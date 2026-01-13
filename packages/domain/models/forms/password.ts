import { z } from 'zod';

export const passwordSchema = z.string().min(6, { message: 'validation.password.minLength' });
// .max(20, { message: 'validation.password.maxLength' })
// .refine((password) => /[A-Z]/.test(password), {
//   message: 'validation.password.uppercaseRequired'
// })
// .refine((password) => /[a-z]/.test(password), {
//   message: 'validation.password.lowercaseRequired'
// })
// .refine((password) => /[0-9]/.test(password), {
//   message: 'validation.password.numberRequired'
// })
// .refine((password) => /[!@#$%^&*]/.test(password), {
//   message: 'validation.password.specialCharacterRequired'
// });

export const passwordConfirmationSchema = z.string().min(1, { message: 'validation.password.confirmationRequired' });
