import { z } from 'zod';
import { zfd } from 'zod-form-data';
import { emailSchema } from './email';
import { passwordSchema } from './password';

export const changeEmailFormSchema = zfd.formData({
  newEmail: emailSchema,
  newEmailConfirmation: emailSchema,
  currentPassword: passwordSchema
}).refine(({ newEmail, newEmailConfirmation }) => newEmail === newEmailConfirmation, {
  message: 'validation.email.confirmationMismatch',
  path: ['newEmailConfirmation']
});

export type ChangeEmailFormInput = z.infer<typeof changeEmailFormSchema>;
