import type { ChangeEvent } from 'react';

import { useFieldState } from './use-field-state';
import type { LiveValidationFeedback } from './use-zod-live-validation';

type UseServerFieldValidationOptions<TValue> = {
  value: TValue;
  touched?: boolean;
  serverError?: string;
};

export type ServerFieldValidationResult<TValue = unknown> = {
  value: TValue;
  touched: boolean;
  setValue: (value: TValue) => void;
  setTouched: (touched: boolean) => void;
  markTouched: () => void;
  feedbackProps: (serverError?: string) => LiveValidationFeedback;
  fieldProps: (serverError?: string) => {
    value: TValue;
    onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onBlur: () => void;
  } & LiveValidationFeedback;
};

export function useServerFieldValidation<TValue = unknown>({
  value,
  touched: initialTouched = false,
  serverError: serverErrorFromState
}: UseServerFieldValidationOptions<TValue>): ServerFieldValidationResult<TValue> {
  const fieldState = useFieldState<TValue>({
    value,
    touched: initialTouched
  });

  const resolveServerError = (serverError?: string) => serverError ?? serverErrorFromState;
  const feedback = (serverError?: string): LiveValidationFeedback => {
    const resolvedServerError = resolveServerError(serverError);

    return {
      error: Boolean(resolvedServerError),
      helperText: resolvedServerError
    };
  };

  return {
    value: fieldState.value,
    touched: fieldState.touched,
    setValue: fieldState.setValue,
    setTouched: fieldState.setTouched,
    markTouched: fieldState.markTouched,
    feedbackProps: (serverError?: string) => feedback(serverError),
    fieldProps: (serverError?: string) => ({
      value: fieldState.value,
      onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        fieldState.setValue(event.currentTarget.value as TValue);
      },
      onBlur: fieldState.markTouched,
      ...feedback(serverError)
    })
  };
}
