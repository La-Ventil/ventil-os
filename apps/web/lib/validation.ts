import { ZodError } from 'zod';
import type { TranslationValues } from 'next-intl';

export function isValidationError(err: unknown): err is ZodError {
  return Boolean(err && (err instanceof ZodError || (err as ZodError).name === 'ZodError'));
}

type Translate = (key: string, values?: TranslationValues) => string;

export function zodErrorToFieldErrors(err: ZodError, t: Translate): Record<string, string[]> {
  const out: Record<string, string[]> = {};

  // Utilitaire pour pousser une erreur sur un champ
  const push = (field: string, msg: string) => {
    (out[field] ??= []).push(msg);
  };

  const translateMessage = (messageKey: string) => {
    let translated = messageKey;
    try {
      translated = t(messageKey, { defaultMessage: messageKey });
      if (translated === messageKey) {
        translated = t('validation.genericError', {
          defaultMessage: 'Une erreur est survenue, veuillez vérifier ce champ.'
        });
      }
    } catch {
      translated = 'Une erreur est survenue, veuillez vérifier ce champ.';
    }
    return translated;
  };

  for (const issue of err.issues) {
    const field = issue.path.length ? issue.path.join('.') : '_form';
    push(field, translateMessage(issue.message));
  }

  return out;
}

export function fieldErrorsToSingleMessage(
  fieldErrors: Record<string, string[]>,
  options?: {
    separator?: string;
    deduplicate?: boolean;
    maxMessages?: number;
  }
): string {
  const { separator = ' ', deduplicate = true, maxMessages } = options ?? {};

  let messages = Object.values(fieldErrors).flat();

  if (deduplicate) {
    messages = Array.from(new Set(messages));
  }

  if (typeof maxMessages === 'number') {
    messages = messages.slice(0, maxMessages);
  }

  return messages.join(separator);
}
