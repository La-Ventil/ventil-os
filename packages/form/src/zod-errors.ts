import { ZodError } from 'zod';

type Translate = (key: string, values?: Record<string, string | number | Date>) => string;

export function isValidationError(err: unknown): err is ZodError {
  return Boolean(err && (err instanceof ZodError || (err as ZodError).name === 'ZodError'));
}

export function zodErrorToFieldErrors(err: ZodError, t: Translate): Record<string, string[]> {
  const out: Record<string, string[]> = {};

  const push = (field: string, msg: string) => {
    (out[field] ??= []).push(msg);
  };

  const safeTranslate = (key: string, fallback: string) => {
    try {
      return t(key, { defaultMessage: fallback } as Record<string, string>);
    } catch {
      return fallback;
    }
  };

  const translateMessage = (messageKey: string) => {
    const fallback = 'Une erreur est survenue, veuillez vérifier ce champ.';
    const looksLikeKey = messageKey.includes('.') && !messageKey.includes(' ');

    if (!looksLikeKey) {
      return safeTranslate('validation.genericError', fallback);
    }

    const translated = safeTranslate(messageKey, messageKey);
    if (translated === messageKey) {
      return safeTranslate('validation.genericError', fallback);
    }
    return translated;
  };

  for (const issue of err.issues) {
    const field = issue.path.length ? issue.path.join('.') : '_form';
    push(field, translateMessage(issue.message));
  }

  return out;
}
