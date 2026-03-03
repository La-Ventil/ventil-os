import type { FormState } from '../form-state';

export type FormFieldErrors<FormData> = FormState<FormData>['fieldErrors'] | Record<string, string[]>;

export type FormErrorMessageStrategy = 'message-first' | 'first-field' | 'join-fields';

export type FormFeedback = {
  type: 'success' | 'error';
  message: string;
};

type FlattenFieldErrorOptions = {
  deduplicate?: boolean;
  maxMessages?: number;
};

type FieldErrorMessageOptions = FlattenFieldErrorOptions & {
  separator?: string;
};

type ResolveFormErrorMessageOptions = FieldErrorMessageOptions & {
  fallbackMessage?: string;
  errorStrategy?: FormErrorMessageStrategy;
};

type ResolveFormFeedbackOptions = Omit<ResolveFormErrorMessageOptions, 'fallbackMessage'> & {
  fallbackErrorMessage?: string;
  fallbackSuccessMessage?: string;
};

const normalizeMessage = (message?: string): string | undefined => {
  const trimmed = message?.trim();
  return trimmed ? trimmed : undefined;
};

export function flattenFieldErrors<FormData>(
  fieldErrors: FormFieldErrors<FormData>,
  options?: FlattenFieldErrorOptions
): string[] {
  const { deduplicate = true, maxMessages } = options ?? {};

  let messages = Object.values(fieldErrors).flat().filter(Boolean);

  if (deduplicate) {
    messages = Array.from(new Set(messages));
  }

  if (typeof maxMessages === 'number') {
    messages = messages.slice(0, maxMessages);
  }

  return messages;
}

export function fieldErrorsToMessage<FormData>(
  fieldErrors: FormFieldErrors<FormData>,
  options?: FieldErrorMessageOptions
): string {
  const { separator = ' ', ...flattenOptions } = options ?? {};
  return flattenFieldErrors(fieldErrors, flattenOptions).join(separator);
}

export function resolveFormErrorMessage<FormData>(
  state: Pick<FormState<FormData>, 'message'> & { fieldErrors?: FormFieldErrors<FormData> },
  options?: ResolveFormErrorMessageOptions
): string {
  const { fallbackMessage = '', errorStrategy = 'message-first', ...fieldOptions } = options ?? {};
  const normalizedMessage = normalizeMessage(state.message);
  const flattenedFieldErrors = state.fieldErrors ? flattenFieldErrors(state.fieldErrors, fieldOptions) : [];
  const firstFieldMessage = flattenedFieldErrors[0];
  const joinedFieldMessage = flattenedFieldErrors.join(fieldOptions.separator ?? ' ');

  switch (errorStrategy) {
    case 'first-field':
      return firstFieldMessage ?? normalizedMessage ?? fallbackMessage;
    case 'join-fields':
      return joinedFieldMessage || normalizedMessage || fallbackMessage;
    case 'message-first':
    default:
      return normalizedMessage ?? firstFieldMessage ?? fallbackMessage;
  }
}

export function resolveFormFeedback<FormData>(
  state: Pick<FormState<FormData>, 'success' | 'message'> & { fieldErrors?: FormFieldErrors<FormData> },
  options?: ResolveFormFeedbackOptions
): FormFeedback | null {
  if (state.success) {
    const successMessage = normalizeMessage(state.message) ?? options?.fallbackSuccessMessage;
    return successMessage ? { type: 'success', message: successMessage } : null;
  }

  const message = resolveFormErrorMessage(state, {
    fallbackMessage: options?.fallbackErrorMessage,
    errorStrategy: options?.errorStrategy,
    separator: options?.separator,
    deduplicate: options?.deduplicate,
    maxMessages: options?.maxMessages
  });

  return message ? { type: 'error', message } : null;
}
