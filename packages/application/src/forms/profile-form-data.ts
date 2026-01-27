import { z } from 'zod';
import { zfd } from 'zod-form-data';

export const profileFormDataSchema = zfd.formData({
  firstName: z.string().min(1, { message: 'validation.profile.firstNameRequired' }),
  lastName: z.string().min(1, { message: 'validation.profile.lastNameRequired' }),
  educationLevel: z.string().min(1, { message: 'validation.profile.educationLevelRequired' })
});
export type ProfileFormData = z.infer<typeof profileFormDataSchema>;
