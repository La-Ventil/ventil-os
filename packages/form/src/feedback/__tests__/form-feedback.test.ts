import { describe, expect, it } from 'vitest';
import { fieldErrorsToMessage, flattenFieldErrors, resolveFormErrorMessage, resolveFormFeedback } from '../form-feedback';

describe('flattenFieldErrors', () => {
  it('flattens and deduplicates by default', () => {
    expect(
      flattenFieldErrors({
        email: ['Required', 'Required'],
        password: ['Too short']
      })
    ).toEqual(['Required', 'Too short']);
  });

  it('supports limiting the number of messages', () => {
    expect(
      flattenFieldErrors(
        {
          email: ['Required'],
          password: ['Too short'],
          profile: ['Invalid']
        },
        { maxMessages: 2 }
      )
    ).toEqual(['Required', 'Too short']);
  });
});

describe('fieldErrorsToMessage', () => {
  it('joins field errors into a single message', () => {
    expect(
      fieldErrorsToMessage({
        email: ['Required'],
        password: ['Too short']
      })
    ).toBe('Required Too short');
  });
});

describe('resolveFormErrorMessage', () => {
  const state = {
    success: false,
    message: 'Business error',
    fieldErrors: {
      email: ['Required'],
      password: ['Too short']
    }
  };

  it('prefers the form message by default', () => {
    expect(resolveFormErrorMessage(state)).toBe('Business error');
  });

  it('can prefer the first field message', () => {
    expect(resolveFormErrorMessage(state, { errorStrategy: 'first-field' })).toBe('Required');
  });

  it('can join field messages', () => {
    expect(resolveFormErrorMessage(state, { errorStrategy: 'join-fields' })).toBe('Required Too short');
  });
});

describe('resolveFormFeedback', () => {
  it('returns success feedback with a fallback success message', () => {
    expect(
      resolveFormFeedback(
        {
          success: true,
          message: '',
          fieldErrors: {}
        },
        { fallbackSuccessMessage: 'Saved' }
      )
    ).toEqual({ type: 'success', message: 'Saved' });
  });

  it('returns error feedback using the configured field strategy', () => {
    expect(
      resolveFormFeedback(
        {
          success: false,
          message: '',
          fieldErrors: {
            email: ['Required'],
            password: ['Too short']
          }
        },
        {
          fallbackErrorMessage: 'Generic error',
          errorStrategy: 'join-fields'
        }
      )
    ).toEqual({ type: 'error', message: 'Required Too short' });
  });
});
