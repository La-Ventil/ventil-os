import type { FormFieldErrors, FormState } from '@repo/form/form-state';
import { formError, formValidationError } from '@repo/form/form-state-builders';
import { isOpenBadgeError, type OpenBadgeErrorCode } from '@repo/domain/badge/open-badge-errors';

type Translate = (key: string) => string;

const resolveOpenBadgeErrorMessage = (error: unknown, t: Translate, fallbackErrorMessage: string): string =>
  isOpenBadgeError(error) ? t(error.code) : t(fallbackErrorMessage);

const INLINE_OPEN_BADGE_FIELD_ERRORS: Partial<Record<OpenBadgeErrorCode, string>> = {
  'openBadge.update.levelInUse': 'levels'
};

export const withOpenBadgeFormError = <TValues>(
  values: TValues,
  error: unknown,
  t: Translate,
  fallbackErrorMessage: string = 'validation.genericError'
): FormState<TValues> => {
  if (isOpenBadgeError(error)) {
    const field = INLINE_OPEN_BADGE_FIELD_ERRORS[error.code];

    if (field) {
      return formValidationError(values, { [field]: [t(error.code)] } as FormFieldErrors<TValues>);
    }
  }

  return formError(values, { message: resolveOpenBadgeErrorMessage(error, t, fallbackErrorMessage) });
};

export const isOpenBadgeDomainError = isOpenBadgeError;
