import { z } from 'zod';
import { zfd } from 'zod-form-data';
import { emailSchema } from './email';

export const loginFormDataSchema = zfd.formData({
  email: emailSchema
});

export type LoginFormData = z.infer<typeof loginFormDataSchema>;
