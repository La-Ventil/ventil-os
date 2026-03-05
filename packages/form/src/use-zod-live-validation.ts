import type { ChangeEvent } from 'react';

import { zodErrorMessagesFromSchema } from './zod-errors';

import { useFieldState } from './use-field-state';

export type Translate = (key: string, values?: Record<string, string | number | Date>) => string;

type LiveValidationSchema = Parameters<typeof zodErrorMessagesFromSchema>[0]['schema'];
type LiveValidationValues = Parameters<typeof zodErrorMessagesFromSchema>[0];

type LiveValidationOptions<TValue> = {
  schema: LiveValidationSchema;
  value: TValue;
  t?: Translate;
  touched?: boolean;
  skipUntouchedBlank?: (value: TValue) => boolean;
  serverError?: string;
};

export type LiveValidationFeedback = {
  error: boolean;
  helperText?: string;
};

type LiveValidationFieldProps<TValue> = {
  value: TValue;
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onBlur: () => void;
} & LiveValidationFeedback;

export type LiveValidationResult<TValue = unknown> = {
  value: TValue;
  errors: string[];
  touched: boolean;
  setValue: (value: TValue) => void;
  setTouched: (touched: boolean) => void;
  markTouched: () => void;
  inputProps: () => {
    value: TValue;
    onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onBlur: () => void;
  };
  feedbackProps: (serverError?: string) => LiveValidationFeedback;
  fieldProps: (serverError?: string) => LiveValidationFieldProps<TValue>;
  fieldFeedback: (serverError?: string) => LiveValidationFeedback;
};

export function useZodLiveValidation<TValue = unknown>({
  schema,
  value,
  t,
  touched: initialTouched = false,
  skipUntouchedBlank,
  serverError: serverErrorFromState
}: LiveValidationOptions<TValue>): LiveValidationResult<TValue> {
  const fieldState = useFieldState<TValue>({
    value,
    touched: initialTouched
  });

  const errors = zodErrorMessagesFromSchema({
    schema,
    value: fieldState.value,
    touched: fieldState.touched,
    t,
    skipUntouchedBlank: skipUntouchedBlank as LiveValidationValues['skipUntouchedBlank']
  });

  const resolveServerError = (serverError?: string) => serverError ?? serverErrorFromState;

  const fieldFeedback = (serverError?: string): LiveValidationFeedback => {
    const resolvedServerError = resolveServerError(serverError);
    const helperText = errors.length > 0 ? errors.join(' ') : resolvedServerError;
    return {
      error: errors.length > 0 || Boolean(resolvedServerError),
      helperText
    };
  };

  return {
    value: fieldState.value,
    errors,
    touched: fieldState.touched,
    setValue: fieldState.setValue,
    setTouched: fieldState.setTouched,
    markTouched: fieldState.markTouched,
    inputProps: () => ({
      value: fieldState.value,
      onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        fieldState.setValue(event.currentTarget.value as TValue);
      },
      onBlur: fieldState.markTouched
    }),
    feedbackProps: (serverError?: string) => fieldFeedback(serverError),
    fieldProps: (serverError?: string): LiveValidationFieldProps<TValue> => ({
      value: fieldState.value,
      onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        fieldState.setValue(event.currentTarget.value as TValue);
      },
      onBlur: fieldState.markTouched,
      ...fieldFeedback(serverError)
    }),
    fieldFeedback: (serverError?: string) => fieldFeedback(serverError)
  };
}
