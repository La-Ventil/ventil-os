import { zodErrorToFieldErrors } from './zod-errors';
import {
  type FieldValidationFeedback,
  type FieldValidationInputProps,
  type Translate,
  createFieldFeedback,
  createFieldInputProps
} from './field-validation-shared';
import { z } from 'zod';
import { useFieldState } from './use-field-state';

type FieldKey = string;

type UseFormFieldCrossValidationOptions<TValues extends Record<FieldKey, unknown>, TField extends keyof TValues> = {
  values: TValues;
  field: TField;
  schema: z.ZodType<Record<string, unknown>>;
  touched?: boolean;
  serverError?: string;
  t?: Translate;
};

export type FormFieldCrossValidationResult<TValue = unknown> = {
  value: TValue;
  errors: string[];
  touched: boolean;
  setValue: (value: TValue) => void;
  setTouched: (touched: boolean) => void;
  markTouched: () => void;
  inputProps: () => FieldValidationInputProps<TValue>;
  feedbackProps: (serverError?: string) => FieldValidationFeedback;
  fieldProps: (serverError?: string) => FieldValidationInputProps<TValue> & FieldValidationFeedback;
};

export function useFormFieldCrossValidation<
  TValues extends Record<FieldKey, unknown>,
  TField extends Extract<keyof TValues, FieldKey>
>(options: UseFormFieldCrossValidationOptions<TValues, TField>): FormFieldCrossValidationResult<TValues[TField]> {
  const {
    values,
    field,
    schema,
    touched: initialTouched = false,
    serverError: serverErrorFromState,
    t = (key) => key
  } = options;

  const fieldState = useFieldState<TValues[TField]>({
    value: values[field] as TValues[TField],
    touched: initialTouched
  });

  const resolveServerError = (serverError?: string) => serverError ?? serverErrorFromState;

  const parseResult = schema.safeParse({
    ...values,
    [field]: fieldState.value
  });

  const isFieldError = () => {
    if (!fieldState.touched || parseResult.success) {
      return [];
    }

    const allErrors = zodErrorToFieldErrors(parseResult.error, t);
    const messages = allErrors[field as string];
    return messages ?? [];
  };

  const errors = isFieldError();
  const fieldFeedback = (serverError?: string): FieldValidationFeedback =>
    createFieldFeedback(errors, () => resolveServerError(serverError));
  const inputProps = createFieldInputProps<TValues[TField]>(
    fieldState.value,
    fieldState.setValue,
    fieldState.markTouched
  );

  return {
    value: fieldState.value,
    errors,
    touched: fieldState.touched,
    setValue: fieldState.setValue,
    setTouched: fieldState.setTouched,
    markTouched: fieldState.markTouched,
    inputProps: () => inputProps,
    feedbackProps: (serverError?: string) => fieldFeedback(serverError),
    fieldProps: (serverError?: string) => ({
      ...inputProps,
      ...fieldFeedback(serverError)
    })
  };
}
