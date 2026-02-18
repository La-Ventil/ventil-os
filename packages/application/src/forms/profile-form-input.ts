import { z } from 'zod';
import { zfd } from 'zod-form-data';
import { requiresEducationLevel, type UserRole } from '@repo/domain/user/user-role';

export const profileFormSchema = zfd.formData({
  firstName: z.string().min(1, { message: 'validation.profile.firstNameRequired' }),
  lastName: z.string().min(1, { message: 'validation.profile.lastNameRequired' }),
  educationLevel: zfd.text(z.string().optional())
});

export const buildProfileFormSchema = (role: UserRole) =>
  profileFormSchema.superRefine(({ educationLevel }, ctx) => {
    if (requiresEducationLevel(role) && !educationLevel) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'validation.profile.educationLevelRequired',
        path: ['educationLevel']
      });
    }
  });

export const parseProfileFormInput = (formData: FormData, role: UserRole) =>
  buildProfileFormSchema(role).safeParse(formData);

export type ProfileFormInput = z.infer<typeof profileFormSchema>;
