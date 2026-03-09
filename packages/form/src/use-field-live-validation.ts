import { zodErrorMessagesFromSchema } from './zod-errors';
import {
  type FieldValidationFeedback,
  type FieldValidationInputProps,
  type Translate,
  type ZodFieldValidationOptions,
  type ZodFieldValidationSchema,
  createFieldFeedback,
  createFieldInputProps
} from './field-validation-shared';
export type { Translate } from './field-validation-shared';

import { useFieldState } from './use-field-state';

type LiveValidationOptions<TValue> = {
  schema: ZodFieldValidationSchema;
  value: TValue;
  t?: Translate;
  touched?: boolean;
  skipUntouchedBlank?: (value: TValue) => boolean;
  serverError?: string;
};

export type FieldLiveValidationResult<TValue = unknown> = {
  value: TValue;
  errors: string[];
  touched: boolean;
  setValue: (value: TValue) => void;
  setTouched: (touched: boolean) => void;
  markTouched: () => void;
  inputProps: () => FieldValidationInputProps<TValue>;
  feedbackProps: (serverError?: string) => FieldValidationFeedback;
  fieldProps: (serverError?: string) => FieldValidationInputProps<TValue> & FieldValidationFeedback;
  fieldFeedback: (serverError?: string) => FieldValidationFeedback;
};

export function useFieldLiveValidation<TValue = unknown>({
  schema,
  value,
  t = (key) => key,
  touched: initialTouched = false,
  skipUntouchedBlank,
  serverError: serverErrorFromState
}: LiveValidationOptions<TValue>): FieldLiveValidationResult<TValue> {
  const fieldState = useFieldState<TValue>({
    value,
    touched: initialTouched
  });

  const errors = zodErrorMessagesFromSchema({
    schema,
    value: fieldState.value,
    touched: fieldState.touched,
    t,
    skipUntouchedBlank: skipUntouchedBlank as ZodFieldValidationOptions['skipUntouchedBlank']
  });

  const resolveServerError = (serverError?: string) => serverError ?? serverErrorFromState;
  const fieldFeedback = (serverError?: string): FieldValidationFeedback =>
    createFieldFeedback(errors, () => resolveServerError(serverError));

  const inputProps = createFieldInputProps<TValue>(fieldState.value, fieldState.setValue, fieldState.markTouched);

  return {
    value: fieldState.value,
    errors,
    touched: fieldState.touched,
    setValue: fieldState.setValue,
    setTouched: fieldState.setTouched,
    markTouched: fieldState.markTouched,
    inputProps: () => inputProps,
    feedbackProps: (serverError?: string) => fieldFeedback(serverError),
    fieldProps: (serverError?: string): FieldValidationInputProps<TValue> & FieldValidationFeedback => ({
      ...inputProps,
      ...fieldFeedback(serverError)
    }),
    fieldFeedback: (serverError?: string) => fieldFeedback(serverError)
  };
}
