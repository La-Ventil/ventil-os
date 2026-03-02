import { z } from 'zod';

export const PASSWORD_MIN_LENGTH = 7;
export const passwordHasUppercase = (value: string): boolean => /[A-Z]/.test(value);
export const passwordHasLowercase = (value: string): boolean => /[a-z]/.test(value);
export const passwordHasNumber = (value: string): boolean => /[0-9]/.test(value);

export const passwordSchema = z
  .string()
  .min(PASSWORD_MIN_LENGTH, { message: 'validation.password.minLength' })
  .refine((password) => passwordHasUppercase(password), {
    message: 'validation.password.uppercaseRequired'
  })
  .refine((password) => passwordHasLowercase(password), {
    message: 'validation.password.lowercaseRequired'
  })
  .refine((password) => passwordHasNumber(password), {
    message: 'validation.password.numberRequired'
  });

export const passwordConfirmationSchema = z.string().min(1, { message: 'validation.password.confirmationRequired' });
