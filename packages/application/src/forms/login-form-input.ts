import { z } from 'zod';
import { zfd } from 'zod-form-data';
import { emailSchema } from './email';

export const loginFormSchema = zfd.formData({
  email: emailSchema
});

export type LoginFormInput = z.infer<typeof loginFormSchema>;
