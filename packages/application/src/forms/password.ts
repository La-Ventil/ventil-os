import { z } from 'zod';

export const passwordSchema = z
  .string()
  .min(7, { message: 'validation.password.minLength' })
  .refine((password) => /[A-Z]/.test(password), {
    message: 'validation.password.uppercaseRequired'
  })
  .refine((password) => /[a-z]/.test(password), {
    message: 'validation.password.lowercaseRequired'
  })
  .refine((password) => /[0-9]/.test(password), {
    message: 'validation.password.numberRequired'
  });

export const passwordConfirmationSchema = z.string().min(1, { message: 'validation.password.confirmationRequired' });
