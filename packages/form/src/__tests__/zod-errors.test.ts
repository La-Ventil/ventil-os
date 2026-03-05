import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { zodErrorToFieldErrors, zodErrorToMessages } from '../zod-errors';

describe('zodErrorToMessages', () => {
  it('returns raw issue messages when no translator is provided', () => {
    const schema = z.string().min(7, { message: 'validation.password.minLength' });
    const parsed = schema.safeParse('abc');

    expect(parsed.success).toBe(false);
    if (parsed.success) return;

    expect(zodErrorToMessages(parsed.error)).toEqual(['validation.password.minLength']);
  });

  it('translates issue messages when translator is provided', () => {
    const schema = z.string().min(7, { message: 'validation.password.minLength' });
    const parsed = schema.safeParse('abc');

    expect(parsed.success).toBe(false);
    if (parsed.success) return;

    const messages = zodErrorToMessages(parsed.error, (key) => {
      if (key === 'validation.password.minLength') return 'Mot de passe trop court';
      if (key === 'validation.genericError') return 'Erreur de validation';
      return key;
    });

    expect(messages).toEqual(['Mot de passe trop court']);
  });

  it('falls back to generic validation error for non-key messages', () => {
    const schema = z.string().refine(() => false, { message: 'Password must be stronger' });
    const parsed = schema.safeParse('abc');

    expect(parsed.success).toBe(false);
    if (parsed.success) return;

    const messages = zodErrorToMessages(parsed.error, (key) => {
      if (key === 'validation.genericError') return 'Erreur de validation';
      return key;
    });

    expect(messages).toEqual(['Erreur de validation']);
  });
});

describe('zodErrorToFieldErrors', () => {
  it('uses the same translation rules for field errors', () => {
    const schema = z.object({
      password: z.string().min(7, { message: 'validation.password.minLength' })
    });
    const parsed = schema.safeParse({ password: 'abc' });

    expect(parsed.success).toBe(false);
    if (parsed.success) return;

    const fieldErrors = zodErrorToFieldErrors(parsed.error, (key) => {
      if (key === 'validation.password.minLength') return 'Mot de passe trop court';
      if (key === 'validation.genericError') return 'Erreur de validation';
      return key;
    });

    expect(fieldErrors).toEqual({
      password: ['Mot de passe trop court']
    });
  });
});
