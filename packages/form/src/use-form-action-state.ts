import { startTransition, useActionState, useEffect, useRef, useState } from 'react';
import { z } from 'zod';
import type { FormEventHandler } from 'react';
import type { FormState } from './form-state';
import type { FormAction, FormActionDispatch } from './form-action-state';
import { formDataToRedisplayValues, formDataToValues } from './form-data';
import type { Translate } from './field-validation-shared';
import { fieldErrorsToMessage } from './feedback/form-feedback';
import { zodErrorToFieldErrors } from './zod-errors';

type SchemaLike = z.ZodType<Record<string, unknown>>;
type InferSchema<Schema extends SchemaLike> = z.infer<Schema>;

type Translator = Translate;

const safeTranslate = (translate: Translator, key: string, fallback: string) => {
  try {
    const translated = translate(key);
    return translated === key ? fallback : translated;
  } catch {
    return fallback;
  }
};

const preferNamespaceFallback = (translate: Translator, key: string, fallbackKey: string) => {
  const fallback = safeTranslate(translate, fallbackKey, key);
  return fallback === key ? key : fallback;
};

/** Field error keys are dotted (`levels.0.title`); control names use brackets (`levels[0].title`). */
export const fieldErrorKeyToControlName = (key: string) => key.replace(/\.(\d+)(?=\.|$)/g, '[$1]');

/**
 * Moves the focus to the first control the form rejected, in document order.
 * Without it the error summary sits at the top of the page while the submit button is at the bottom,
 * so the feedback lands off-screen.
 */
const focusFirstInvalidControl = (form: HTMLFormElement, fieldErrors: Record<string, string[] | undefined>) => {
  const invalidNames = new Set(
    Object.entries(fieldErrors)
      .filter(([, messages]) => messages && messages.length > 0)
      .map(([key]) => fieldErrorKeyToControlName(key))
  );

  if (invalidNames.size === 0) return;

  const control = Array.from(form.elements).find((element): element is HTMLElement => {
    if (!(element instanceof HTMLElement)) return false;
    const name = (element as HTMLElement & { name?: string }).name;
    if (!name || !invalidNames.has(name)) return false;
    return !(element as HTMLElement & { disabled?: boolean }).disabled;
  });

  control?.focus();
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
  const formRef = useRef<HTMLFormElement | null>(null);
  const lastFocusedStateRef = useRef<FormState<Values> | null>(null);

  const effectiveState = clientState ?? state;

  // Runs once per submit outcome, whether it was rejected by the client parse or by the server action.
  useEffect(() => {
    if (isPending) return;
    if (lastFocusedStateRef.current === effectiveState) return;
    lastFocusedStateRef.current = effectiveState;

    const form = formRef.current;
    if (!form || effectiveState.success) return;

    focusFirstInvalidControl(form, (effectiveState.fieldErrors ?? {}) as Record<string, string[] | undefined>);
  }, [effectiveState, isPending]);
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
    formRef.current = form;
    const formData = new FormData(form);
    setLastFormData(formData);

    const parseResult = schema.safeParse(formData);
    if (!parseResult.success) {
      const fieldErrors = translateFieldErrors(
        zodErrorToFieldErrors(parseResult.error, translateFieldError ?? translate)
      );
      setClientState({
        success: false,
        valid: false,
        message: fieldErrorsToMessage(fieldErrors) || translateFormMessage('errors.invalid'),
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
