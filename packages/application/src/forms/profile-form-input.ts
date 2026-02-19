import { z } from 'zod';
import { zfd } from 'zod-form-data';
import { requiresEducationLevel, type UserRole } from '@repo/domain/user/user-role';
import { nameSchema } from './name';

export const profileFormSchema = zfd.formData({
  firstName: nameSchema({
    requiredMessage: 'validation.profile.firstNameRequired',
    maxLengthMessage: 'validation.profile.firstNameMaxLength',
    noEmojiMessage: 'validation.profile.firstNameNoEmoji'
  }),
  lastName: nameSchema({
    requiredMessage: 'validation.profile.lastNameRequired',
    maxLengthMessage: 'validation.profile.lastNameMaxLength',
    noEmojiMessage: 'validation.profile.lastNameNoEmoji'
  }),
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
