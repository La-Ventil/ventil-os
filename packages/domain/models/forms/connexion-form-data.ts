import { z } from 'zod';
import { zfd } from 'zod-form-data';
import { emailSchema } from './email';

export const connexionFormDataSchema = zfd.formData({
  email: emailSchema
});

export type ConnexionFormData = z.infer<typeof connexionFormDataSchema>;
