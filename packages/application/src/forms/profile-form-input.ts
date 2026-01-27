import { z } from 'zod';
import { zfd } from 'zod-form-data';

export const profileFormSchema = zfd.formData({
  firstName: z.string().min(1, { message: 'validation.profile.firstNameRequired' }),
  lastName: z.string().min(1, { message: 'validation.profile.lastNameRequired' }),
  educationLevel: z.string().min(1, { message: 'validation.profile.educationLevelRequired' })
});
export type ProfileFormInput = z.infer<typeof profileFormSchema>;
