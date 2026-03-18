import { z } from 'zod';
import { zfd } from 'zod-form-data';
import { requiresEducationLevel, type UserRole as UserRoleValue } from '@repo/domain/user/user-role';
import { nameSchema } from './name';
import { educationLevelInputSchema, userRoleInputSchema } from './profile-education';

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

const userRoleSchema = userRoleInputSchema('validation.profile.roleRequired');

export const adminProfileFormSchema = zfd.formData({
  ...profileFormShape,
  profile: userRoleSchema
});

export const buildAdminProfileFormSchema = () =>
  adminProfileFormSchema.superRefine(({ educationLevel, profile }, ctx) => {
    if (requiresEducationLevel(profile) && !educationLevel) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'validation.profile.educationLevelRequired',
        path: ['educationLevel']
      });
    }
  });

export const parseAdminProfileFormInput = (formData: FormData) => buildAdminProfileFormSchema().safeParse(formData);

export type ProfileFormInput = z.infer<typeof profileFormSchema>;
export type AdminProfileFormInput = z.infer<typeof adminProfileFormSchema>;
