import { startTransition, useActionState, useState } from 'react';
import { z } from 'zod';
import type { FormEventHandler } from 'react';
import type { FormState } from './form-state';
import type { FormAction, FormActionDispatch } from './form-action-state';
import { formDataToRedisplayValues, formDataToValues } from './form-data';

type SchemaLike = z.ZodType<Record<string, unknown>>;
type InferSchema<Schema extends SchemaLike> = z.infer<Schema>;

type Translator = (key: string, params?: Record<string, string>) => string;

type TranslatorFallbackParams = {
  [key: string]: string;
};

const safeTranslate = (translate: Translator, key: string, fallback: string) => {
  try {
    return translate(key, { defaultMessage: fallback } as TranslatorFallbackParams);
  } catch {
    return fallback;
  }
};

const preferNamespaceFallback = (translate: Translator, key: string, fallbackKey: string) => {
  const fallback = safeTranslate(translate, fallbackKey, key);
  return fallback === key ? key : fallback;
};

/**
 * Config for useFormActionState: wraps React's useActionState with client-side
 * validation + retry handling while keeping a FormState shape.
 */
export type FormActionStateConfig<Schema extends SchemaLike> = {
  action: FormAction<InferSchema<Schema>>;
  initialState: FormState<InferSchema<Schema>>;
  schema: Schema;
  translate: Translator;
  translateFieldError?: Translator;
};

/**
 * Tuple returned by useFormActionState:
 * [state, action, isPending, handleSubmit, handleRetry]
 */
export type FormActionStateTuple<Values extends Record<string, unknown>> = readonly [
  FormState<Values>,
  FormActionDispatch,
  boolean,
  FormEventHandler<HTMLFormElement>,
  () => Promise<void>
];

/**
 * useFormActionState
 * - Runs schema.safeParse on FormData before submitting
 * - On client validation errors, returns FormState with fieldErrors + message
 * - On network failure, keeps values + exposes handleRetry()
 *
 * The returned action should still be wired to the <form action={action}>.
 */
export function useFormActionState<Schema extends SchemaLike>({
  action,
  initialState,
  schema,
  translate,
  translateFieldError
}: FormActionStateConfig<Schema>) {
  type Values = InferSchema<Schema>;
  const [state, actionStateAction, isPending] = useActionState<FormState<Values>, FormData>(
    action,
    initialState as Awaited<FormState<Values>>
  );
  const [clientState, setClientState] = useState<FormState<Values> | null>(null);
  const [lastFormData, setLastFormData] = useState<FormData | null>(null);

  const effectiveState = clientState ?? state;
  const toValues = (formData: FormData) => formDataToValues(formData, schema) as Values;
  const toValuesOrRedisplay = (formData: FormData, fallbackValues: Values): Values => {
    try {
      return toValues(formData);
    } catch {
      return formDataToRedisplayValues(formData, fallbackValues);
    }
  };
  const translateErrorMessage = (message: string) => {
    const looksLikeKey = message.includes('.') && !message.includes(' ');
    if (!looksLikeKey) return message;

    const translator = translateFieldError ?? translate;
    try {
      const translated = translator(message);
      return translated === message ? message : translated;
    } catch {
      return message;
    }
  };
  const translateFormMessage = (key: string) => {
    const translated = safeTranslate(translate, key, key);
    if (translated !== key) {
      return translated;
    }

    if (!key.startsWith('errors.')) {
      return key;
    }

    return preferNamespaceFallback(translate, key, `common.${key}`);
  };
  const translateFieldErrors = (fieldErrors: Record<string, string[] | undefined>) =>
    Object.fromEntries(
      Object.entries(fieldErrors)
        .filter(([, messages]) => messages && messages.length > 0)
        .map(([field, messages]) => [field, (messages ?? []).map((message) => translateErrorMessage(message))])
    ) as FormState<Values>['fieldErrors'];
  const createNetworkErrorState = (formData: FormData, fallbackValues: Values): FormState<Values> => ({
    success: false,
    valid: true,
    message: translateFormMessage('errors.network'),
    fieldErrors: {},
    values: toValuesOrRedisplay(formData, fallbackValues)
  });
  const shouldBlockForOffline = (formData: FormData, fallbackValues: Values) => {
    if (typeof navigator === 'undefined' || navigator.onLine) return false;
    setClientState(createNetworkErrorState(formData, fallbackValues));
    return true;
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    setLastFormData(formData);

    const parseResult = schema.safeParse(formData);
    if (!parseResult.success) {
      const fieldErrors = translateFieldErrors(parseResult.error.flatten().fieldErrors);
      setClientState({
        success: false,
        valid: false,
        message: translateFormMessage('errors.invalid'),
        fieldErrors,
        values: formDataToRedisplayValues(formData, effectiveState.values)
      });
      return;
    }

    setClientState(null);
    if (shouldBlockForOffline(formData, effectiveState.values)) return;
    try {
      startTransition(() => {
        actionStateAction(formData);
      });
    } catch {
      setClientState(createNetworkErrorState(formData, effectiveState.values));
    }
  };

  const handleRetry = async () => {
    if (!lastFormData) return;
    setClientState(null);
    if (shouldBlockForOffline(lastFormData, effectiveState.values)) return;
    try {
      startTransition(() => {
        actionStateAction(lastFormData);
      });
    } catch {
      setClientState(createNetworkErrorState(lastFormData, effectiveState.values));
    }
  };

  return [effectiveState, actionStateAction, isPending, handleSubmit, handleRetry] as FormActionStateTuple<Values>;
}
