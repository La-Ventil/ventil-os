import { ZodError, type ZodType } from 'zod';
import type { Translate } from './field-validation-shared';

export function isValidationError(err: unknown): err is ZodError {
  return Boolean(err && (err instanceof ZodError || (err as ZodError).name === 'ZodError'));
}

const safeTranslate = (t: Translate, key: string, fallback: string) => {
  try {
    return t(key, { defaultMessage: fallback } as Record<string, string>);
  } catch {
    return fallback;
  }
};

const resolveIssueMessage = (messageKey: string, t?: Translate): string => {
  if (!t) {
    return messageKey;
  }

  const looksLikeKey = messageKey.includes('.') && !messageKey.includes(' ');

  if (!looksLikeKey) {
    return messageKey;
  }

  const translated = safeTranslate(t, messageKey, messageKey);
  return translated === messageKey ? messageKey : translated;
};

export function zodErrorToMessages(err: ZodError, t?: Translate): string[] {
  return err.issues.map((issue) => resolveIssueMessage(issue.message, t));
}

const isBlankForLiveValidation = (value: unknown): boolean => {
  if (value === undefined || value === null) {
    return true;
  }

  if (typeof value === 'string') {
    return value.length === 0;
  }

  if (Array.isArray(value)) {
    return value.length === 0;
  }

  if (value instanceof FileList) {
    return value.length === 0;
  }

  return false;
};

type LiveValidationInput<TSchema extends ZodType> = {
  schema: TSchema;
  value: unknown;
  touched: boolean;
  t?: Translate;
  skipUntouchedBlank?: (value: unknown) => boolean;
};

export function zodErrorMessagesFromSchema<TSchema extends ZodType>({
  schema,
  value,
  touched,
  t,
  skipUntouchedBlank = isBlankForLiveValidation
}: LiveValidationInput<TSchema>): string[] {
  if (!touched && skipUntouchedBlank(value)) {
    return [];
  }

  const parseResult = schema.safeParse(value);
  if (parseResult.success) {
    return [];
  }

  return zodErrorToMessages(parseResult.error, t);
}

export function zodErrorToFieldErrors(err: ZodError, t: Translate): Record<string, string[]> {
  const out: Record<string, string[]> = {};

  const push = (field: string, msg: string) => {
    (out[field] ??= []).push(msg);
  };

  for (const issue of err.issues) {
    const field = issue.path.length ? issue.path.join('.') : '_form';
    push(field, resolveIssueMessage(issue.message, t));
  }

  return out;
}
