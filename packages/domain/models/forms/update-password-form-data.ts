import { z } from 'zod';
import { zfd } from 'zod-form-data';
import { passwordConfirmationSchema, passwordSchema } from './password';

export const updatePasswordFormDataSchema = zfd
  .formData({
    password: passwordSchema,
    passwordConfirmation: passwordConfirmationSchema
  })
  .refine(({ password, passwordConfirmation }) => password === passwordConfirmation, {
    message: 'validation.password.confirmationMismatch',
    path: ['passwordConfirmation']
  });

export type UpdatePasswordFormData = z.infer<typeof updatePasswordFormDataSchema>;
