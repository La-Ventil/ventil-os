import { describe, expect, it } from 'vitest';
import { fieldErrorMessage, fieldErrorsFor, hasFieldError } from '../form-errors';

type TestValues = {
  email: string;
  password: string;
};

describe('fieldErrorsFor', () => {
  it('returns all messages for one field', () => {
    const state = {
      fieldErrors: {
        email: ['Required', 'Invalid'],
        password: ['Too short']
      }
    };

    expect(fieldErrorsFor<TestValues>(state, 'email')).toEqual(['Required', 'Invalid']);
  });

  it('returns an empty array when the field has no error', () => {
    expect(fieldErrorsFor<TestValues>({ fieldErrors: {} }, 'email')).toEqual([]);
  });
});

describe('hasFieldError', () => {
  it('returns true when at least one message exists', () => {
    expect(
      hasFieldError<TestValues>(
        {
          fieldErrors: {
            email: ['Required']
          }
        },
        'email'
      )
    ).toBe(true);
  });

  it('returns false when there is no message', () => {
    expect(hasFieldError<TestValues>({ fieldErrors: {} }, 'email')).toBe(false);
  });
});

describe('fieldErrorMessage', () => {
  const state = {
    fieldErrors: {
      email: ['Required', 'Invalid', 'Invalid'],
      password: ['Too short']
    }
  };

  it('returns the first message by default', () => {
    expect(fieldErrorMessage<TestValues>(state, 'email')).toBe('Required');
  });

  it('can join messages explicitly', () => {
    expect(fieldErrorMessage<TestValues>(state, 'email', { strategy: 'join' })).toBe('Required Invalid Invalid');
  });

  it('can deduplicate joined messages', () => {
    expect(fieldErrorMessage<TestValues>(state, 'email', { strategy: 'join', deduplicate: true })).toBe(
      'Required Invalid'
    );
  });

  it('can cap the number of returned messages', () => {
    expect(fieldErrorMessage<TestValues>(state, 'email', { strategy: 'join', maxMessages: 2 })).toBe('Required Invalid');
  });
});
