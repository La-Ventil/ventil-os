import { createFormState, type FormState } from './form-state';

type ExtraFields = Record<string, unknown>;
type FormFieldErrors<FormData> = Partial<Record<keyof FormData, string[]>> | Record<string, string[]>;

const normalizeFieldErrors = <FormData>(fieldErrors?: FormFieldErrors<FormData>): FormState<FormData>['fieldErrors'] =>
  (fieldErrors ?? {}) as FormState<FormData>['fieldErrors'];

export const formSuccess = <FormData, Extra extends ExtraFields = ExtraFields>(
  values: FormData,
  message?: string,
  extra?: Extra
): FormState<FormData> & Extra => ({
  ...createFormState(values),
  success: true,
  valid: true,
  message,
  fieldErrors: {},
  ...(extra ?? ({} as Extra))
});

export const formError = <FormData, Extra extends ExtraFields = ExtraFields>(
  values: FormData,
  options: {
    message?: string;
    fieldErrors?: FormFieldErrors<FormData>;
    valid?: boolean;
    errorCode?: string;
  },
  extra?: Extra
): FormState<FormData> & Extra => ({
  ...createFormState(values),
  success: false,
  valid: options.valid ?? true,
  message: options.message,
  fieldErrors: normalizeFieldErrors<FormData>(options.fieldErrors),
  errorCode: options.errorCode,
  ...(extra ?? ({} as Extra))
});

export const formValidationError = <FormData, Extra extends ExtraFields = ExtraFields>(
  values: FormData,
  fieldErrors: FormFieldErrors<FormData>,
  message?: string,
  extra?: Extra
): FormState<FormData> & Extra =>
  formError(
    values,
    {
      valid: false,
      fieldErrors,
      message
    },
    extra
  );
