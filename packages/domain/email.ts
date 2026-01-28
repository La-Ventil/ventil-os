export type Email = string & { readonly __brand: 'Email' };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const Email = {
  from(value: string): Email {
    if (!EMAIL_PATTERN.test(value)) {
      throw new Error('Email must be a valid email address.');
    }

    return value as Email;
  }
};
