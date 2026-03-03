import type { FormState } from './form-state';

/**
 * Field-level accessors for inline form rendering.
 * This module stays intentionally narrow:
 * - use it when a component needs messages for one specific field
 * - use `@repo/form/form-feedback` when a component needs aggregated banner/action feedback
 */
export type FieldErrorMessageStrategy = 'first' | 'join';

type FieldErrorMessageOptions = {
  strategy?: FieldErrorMessageStrategy;
  separator?: string;
  deduplicate?: boolean;
  maxMessages?: number;
};

type FieldErrorState<TValues> = Pick<FormState<TValues>, 'fieldErrors'>;

const normalizeFieldMessages = (messages: string[], options?: Omit<FieldErrorMessageOptions, 'strategy' | 'separator'>): string[] => {
  const { deduplicate = false, maxMessages } = options ?? {};
  let nextMessages = messages.filter(Boolean);

  if (deduplicate) {
    nextMessages = Array.from(new Set(nextMessages));
  }

  if (typeof maxMessages === 'number') {
    nextMessages = nextMessages.slice(0, maxMessages);
  }

  return nextMessages;
};

export const fieldErrorsFor = <TValues>(state: FieldErrorState<TValues>, field: keyof TValues | string): string[] => {
  const fieldErrors = state.fieldErrors as Record<string, string[] | undefined> | undefined;
  return normalizeFieldMessages(fieldErrors?.[String(field)] ?? []);
};

export const hasFieldError = <TValues>(state: FieldErrorState<TValues>, field: keyof TValues | string): boolean =>
  fieldErrorsFor(state, field).length > 0;

export const fieldErrorMessage = <TValues>(
  state: FieldErrorState<TValues>,
  field: keyof TValues | string,
  options?: FieldErrorMessageOptions
): string | undefined => {
  const { strategy = 'first', separator = ' ' } = options ?? {};
  const messages = normalizeFieldMessages(fieldErrorsFor(state, field), options);

  if (!messages.length) {
    return undefined;
  }

  switch (strategy) {
    case 'join':
      return messages.join(separator);
    case 'first':
    default:
      return messages[0];
  }
};
