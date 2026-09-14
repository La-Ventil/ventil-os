import type { ChangeEvent } from 'react';
import type { zodErrorMessagesFromSchema } from './zod-errors';

export type Translate = (key: string, values?: Record<string, string | number | Date>) => string;

export type FieldValidationInputEvent = ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;

export type ZodFieldValidationSchema = Parameters<typeof zodErrorMessagesFromSchema>[0]['schema'];
export type ZodFieldValidationOptions = Parameters<typeof zodErrorMessagesFromSchema>[0];

export type FieldValidationFeedback = {
  error: boolean;
  helperText?: string;
};

export type FieldValidationInputProps<TValue> = {
  value: TValue;
  onChange: (event: FieldValidationInputEvent) => void;
  onBlur: () => void;
};

export const resolveFieldInputValue = <TValue>(event: FieldValidationInputEvent): TValue => {
  return event.currentTarget.value as TValue;
};

export const createFieldFeedback = (
  errors: string[],
  resolveServerError: () => string | undefined,
  options?: { dirty?: boolean }
): FieldValidationFeedback => {
  // A submit error describes the value that was submitted: as soon as the user edits the field,
  // only live validation may speak, otherwise a corrected field keeps showing the stale message.
  const resolvedServerError = options?.dirty ? undefined : resolveServerError();
  const helperText = errors.length > 0 ? errors.join(' ') : resolvedServerError;

  return {
    error: errors.length > 0 || Boolean(resolvedServerError),
    helperText
  };
};

export const createFieldInputProps = <TValue>(
  value: TValue,
  setValue: (value: TValue) => void,
  markTouched: () => void
): FieldValidationInputProps<TValue> => ({
  value,
  onChange: (event) => {
    setValue(resolveFieldInputValue<TValue>(event));
  },
  onBlur: markTouched
});
