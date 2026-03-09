import { z } from 'zod';
import { zfd } from 'zod-form-data';
import { UserRole, requiresEducationLevel, type UserRole as UserRoleValue } from '@repo/domain/user/user-role';
import { nameSchema } from './name';

const profileFormShape = {
  firstName: nameSchema(),
  lastName: nameSchema(),
  educationLevel: zfd.text(z.string().optional())
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

const userRoleSchema = zfd.text(
  z.string().refine((value): value is UserRoleValue => Object.values(UserRole).includes(value as UserRoleValue), {
    message: 'validation.profile.roleRequired'
  })
);

export const adminProfileFormSchema = zfd.formData({
  ...profileFormShape,
  profile: userRoleSchema
});

export const buildAdminProfileFormSchema = () =>
  adminProfileFormSchema.superRefine(({ educationLevel, profile }, ctx) => {
    if (requiresEducationLevel(profile as UserRoleValue) && !educationLevel) {
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
