import { z } from 'zod';
import { zfd } from 'zod-form-data';

export const profileFormSchema = zfd.formData({
  firstName: z.string().min(1, { message: 'validation.profile.firstNameRequired' }),
  lastName: z.string().min(1, { message: 'validation.profile.lastNameRequired' }),
  educationLevel: zfd.text(z.string().optional())
});
export type ProfileFormInput = z.infer<typeof profileFormSchema>;
