import { z } from 'zod';
import { zfd } from 'zod-form-data';
import { emailSchema } from './email';
import { passwordConfirmationSchema, passwordSchema } from './password';
import type { ProfileType } from '@repo/domain/profile-type';
import { requiresEducationLevel } from '@repo/domain/profile-type';

export const signupFormSchema = zfd
  .formData({
    firstName: z.string().min(1, { message: 'validation.signup.firstNameRequired' }),
    lastName: z.string().min(1, { message: 'validation.signup.lastNameRequired' }),
    email: emailSchema,
    password: passwordSchema,
    passwordConfirmation: passwordConfirmationSchema,
    profile: z.string().min(1, { message: 'validation.signup.profileRequired' }),
    terms: z.string().min(1, { message: 'validation.signup.termsRequired' }),
    educationLevel: zfd.text(z.string().optional())
  })
  .refine(({ password, passwordConfirmation }) => password === passwordConfirmation, {
    message: 'validation.password.confirmationMismatch',
    path: ['passwordConfirmation']
  })
  .superRefine(({ profile, educationLevel }, ctx) => {
    if (requiresEducationLevel(profile as ProfileType) && !educationLevel) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'validation.signup.educationLevelRequired',
        path: ['educationLevel']
      });
    }
  });

export type SignupFormInput = z.infer<typeof signupFormSchema>;
