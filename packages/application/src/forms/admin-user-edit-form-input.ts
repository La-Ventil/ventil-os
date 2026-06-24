import { z } from 'zod';
import { zfd } from 'zod-form-data';
import { requiresEducationLevel } from '@repo/domain/user/user-role';
import { nameSchema } from './name';
import { educationLevelInputSchema, userRoleInputSchema } from './profile-education';

export const AdminAccessLevel = {
  None: 'none',
  Pedagogical: 'pedagogical',
  Global: 'global'
} as const;

export type AdminAccessLevel = (typeof AdminAccessLevel)[keyof typeof AdminAccessLevel];

const adminAccessLevelValues = Object.values(AdminAccessLevel) as [AdminAccessLevel, ...AdminAccessLevel[]];

const adminUserEditFormSchema = zfd.formData({
  firstName: nameSchema(),
  lastName: nameSchema(),
  educationLevel: educationLevelInputSchema,
  profile: userRoleInputSchema('validation.profile.roleRequired'),
  adminAccessLevel: zfd.text(
    z
      .string()
      .refine((value): value is AdminAccessLevel => adminAccessLevelValues.includes(value as AdminAccessLevel), {
        message: 'validation.profile.roleRequired'
      })
      .transform((value) => value as AdminAccessLevel)
  )
});

export const buildAdminUserEditFormSchema = () =>
  adminUserEditFormSchema.superRefine(({ educationLevel, profile }, ctx) => {
    if (requiresEducationLevel(profile) && !educationLevel) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'validation.profile.educationLevelRequired',
        path: ['educationLevel']
      });
    }
  });

export const parseAdminUserEditFormInput = (formData: FormData) => buildAdminUserEditFormSchema().safeParse(formData);

export type AdminUserEditFormInput = z.infer<typeof adminUserEditFormSchema>;

export const resolveAdminAccessLevel = (flags: {
  globalAdmin?: boolean;
  pedagogicalAdmin?: boolean;
}): AdminAccessLevel => {
  if (flags.globalAdmin) {
    return AdminAccessLevel.Global;
  }

  if (flags.pedagogicalAdmin) {
    return AdminAccessLevel.Pedagogical;
  }

  return AdminAccessLevel.None;
};
