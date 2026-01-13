import { z } from 'zod';
import { zfd } from 'zod-form-data';
import { passwordConfirmationSchema, passwordSchema } from './password';

export const updatePasswordFormDataSchema = zfd
  .formData({
    motDePasse: passwordSchema,
    confirmationMotDePasse: passwordConfirmationSchema
  })
  .refine(({ motDePasse, confirmationMotDePasse }) => motDePasse === confirmationMotDePasse, {
    message: 'validation.password.confirmationMismatch',
    path: ['confirmationMotDePasse']
  });

export type UpdatePasswordFormData = z.infer<typeof updatePasswordFormDataSchema>;
