import { z } from 'zod';
import { zfd } from 'zod-form-data';
import { emailSchema } from './email';

export const resetPasswordFormSchema = zfd.formData({
  email: emailSchema
});

export type ResetPasswordFormInput = z.infer<typeof resetPasswordFormSchema>;
