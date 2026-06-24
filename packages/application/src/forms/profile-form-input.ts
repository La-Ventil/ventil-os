import { z } from 'zod';
import { zfd } from 'zod-form-data';
import { requiresEducationLevel, type UserRole as UserRoleValue } from '@repo/domain/user/user-role';
import { nameSchema } from './name';
import { educationLevelInputSchema } from './profile-education';

const profileFormShape = {
  firstName: nameSchema(),
  lastName: nameSchema(),
  educationLevel: educationLevelInputSchema
};

export const profileFormSchema = zfd.formData(profileFormShape);

export const buildProfileFormSchema = (role: UserRoleValue) =>
  profileFormSchema.superRefine(({ educationLevel }, ctx) => {
    if (requiresEducationLevel(role) && !educationLevel) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'validation.profile.educationLevelRequired',
        path: ['educationLevel']
      });
    }
  });

export const parseProfileFormInput = (formData: FormData, role: UserRoleValue) =>
  buildProfileFormSchema(role).safeParse(formData);

export type ProfileFormInput = z.infer<typeof profileFormSchema>;
