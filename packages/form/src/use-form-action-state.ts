import { useActionState, useState } from 'react';
import type { FormEventHandler } from 'react';
import type { FormState } from './form-state';
import type { FormAction, FormActionDispatch } from './form-action-state';
import { formDataToStringRecord } from './form-data';

type SafeParseResult =
  | { success: true; data: unknown }
  | { success: false; error: { flatten: () => { fieldErrors: Record<string, string[]> } } };

type SchemaLike = {
  safeParse: (data: FormData) => SafeParseResult;
};

type Translator = (key: string, params?: Record<string, string>) => string;

/**
 * Config for useFormActionState: wraps React's useActionState with client-side
 * validation + retry handling while keeping a FormState shape.
 */
export type FormActionStateConfig<Values extends Record<string, string | string[] | undefined>> = {
  action: FormAction<Values>;
  initialState: FormState<Values>;
  schema: SchemaLike;
  translate: Translator;
  mapFormDataToValues?: (formData: FormData) => Values;
};

/**
 * Tuple returned by useFormActionState:
 * [state, action, isPending, handleSubmit, handleRetry]
 */
export type FormActionStateTuple<Values extends Record<string, string | string[] | undefined>> = readonly [
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
export function useFormActionState<Values extends Record<string, string | string[] | undefined>>({
  action,
  initialState,
  schema,
  translate,
  mapFormDataToValues
}: FormActionStateConfig<Values>) {
  const [state, actionStateAction, isPending] = useActionState<FormState<Values>, FormData>(
    action,
    initialState as Awaited<FormState<Values>>
  );
  const [clientState, setClientState] = useState<FormState<Values> | null>(null);
  const [lastFormData, setLastFormData] = useState<FormData | null>(null);

  const effectiveState = clientState ?? state;
  const toValues = (formData: FormData) =>
    (mapFormDataToValues?.(formData) ?? formDataToStringRecord<Values>(formData)) as Values;

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    setLastFormData(formData);

    const parseResult = schema.safeParse(formData);
    if (!parseResult.success) {
      const fieldErrors = parseResult.error.flatten().fieldErrors as FormState<Values>['fieldErrors'];
      setClientState({
        success: false,
        valid: false,
        message: translate('errors.invalid'),
        fieldErrors,
        values: toValues(formData)
      });
      return;
    }

    setClientState(null);
    try {
      await actionStateAction(formData);
    } catch {
      setClientState({
        success: false,
        valid: true,
        message: translate('errors.network'),
        fieldErrors: {},
        values: toValues(formData)
      });
    }
  };

  const handleRetry = async () => {
    if (!lastFormData) return;
    setClientState(null);
    try {
      await actionStateAction(lastFormData);
    } catch {
      setClientState({
        success: false,
        valid: true,
        message: translate('errors.network'),
        fieldErrors: {},
        values: toValues(lastFormData)
      });
    }
  };

  return [effectiveState, actionStateAction, isPending, handleSubmit, handleRetry] as FormActionStateTuple<Values>;
}
