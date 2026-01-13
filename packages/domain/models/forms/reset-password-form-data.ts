import { z } from 'zod';
import { zfd } from 'zod-form-data';
import { emailSchema } from './email';

export const resetPasswordFormDataSchema = zfd.formData({
  email: emailSchema
});

export type ResetPasswordFormData = z.infer<typeof resetPasswordFormDataSchema>;
