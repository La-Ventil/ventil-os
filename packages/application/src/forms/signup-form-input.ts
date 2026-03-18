import { z } from 'zod';
import { zfd } from 'zod-form-data';
import { emailSchema } from './email';
import { nameSchema } from './name';
import { passwordConfirmationSchema, passwordSchema } from './password';
import { UserRole } from '@repo/domain/user/user-role';
import { requiresEducationLevel } from '@repo/domain/user/user-role';
export { resolveUserRole } from './profile-education';

export const signupFormSchema = zfd
  .formData({
    firstName: nameSchema(),
    lastName: nameSchema(),
    email: emailSchema,
    password: passwordSchema,
    passwordConfirmation: passwordConfirmationSchema,
    profile: z.string().min(1, { message: 'validation.signup.profileRequired' }),
    terms: z.string().min(1, { message: 'validation.signup.termsRequired' }),
    educationLevel: zfd.text(z.string().optional())
  })
  .superRefine(({ password, passwordConfirmation, profile, educationLevel }, ctx) => {
    if (password !== passwordConfirmation) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'validation.password.confirmationMismatch',
        path: ['passwordConfirmation']
      });
    }

    if (requiresEducationLevel(profile as UserRole) && !educationLevel) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'validation.signup.educationLevelRequired',
        path: ['educationLevel']
      });
    }
  });

export type SignupFormInput = z.infer<typeof signupFormSchema>;
