import { z } from 'zod';
import { zfd } from 'zod-form-data';
import { passwordConfirmationSchema, passwordSchema } from './password';

export const changePasswordFormSchema = zfd
  .formData({
    currentPassword: passwordSchema,
    password: passwordSchema,
    passwordConfirmation: passwordConfirmationSchema
  })
  .refine(({ password, passwordConfirmation }) => password === passwordConfirmation, {
    message: 'validation.password.confirmationMismatch',
    path: ['passwordConfirmation']
  });

export type ChangePasswordFormInput = z.infer<typeof changePasswordFormSchema>;
