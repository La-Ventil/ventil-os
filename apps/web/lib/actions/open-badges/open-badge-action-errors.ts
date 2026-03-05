import type { FormState } from '@repo/form/form-state';
import { formError } from '@repo/form/form-state-builders';
import { isOpenBadgeError } from '@repo/domain/badge/open-badge-errors';

type Translate = (key: string, options?: { defaultMessage?: string }) => string;

const resolveOpenBadgeErrorMessage = (error: unknown, t: Translate, fallbackErrorMessage: string): string =>
  isOpenBadgeError(error) ? t(error.code) : t(fallbackErrorMessage);

export const withOpenBadgeFormError = <TValues>(
  values: TValues,
  error: unknown,
  t: Translate,
  fallbackErrorMessage: string = 'validation.genericError'
): FormState<TValues> => formError(values, { message: resolveOpenBadgeErrorMessage(error, t, fallbackErrorMessage) });

export const isOpenBadgeDomainError = isOpenBadgeError;
