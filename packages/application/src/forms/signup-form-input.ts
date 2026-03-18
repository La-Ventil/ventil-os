import { z } from 'zod';
import { zfd } from 'zod-form-data';
import { emailSchema } from './email';
import { nameSchema } from './name';
import { passwordConfirmationSchema, passwordSchema } from './password';
import { requiresEducationLevel } from '@repo/domain/user/user-role';
import { educationLevelInputSchema, userRoleInputSchema } from './profile-education';
export { resolveUserRole } from './profile-education';

export const signupFormSchema = zfd
  .formData({
    firstName: nameSchema(),
    lastName: nameSchema(),
    email: emailSchema,
    password: passwordSchema,
    passwordConfirmation: passwordConfirmationSchema,
    profile: userRoleInputSchema('validation.signup.profileRequired'),
    terms: z.string().min(1, { message: 'validation.signup.termsRequired' }),
    educationLevel: educationLevelInputSchema
  })
  .superRefine(({ password, passwordConfirmation, profile, educationLevel }, ctx) => {
    if (password !== passwordConfirmation) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'validation.password.confirmationMismatch',
        path: ['passwordConfirmation']
      });
    }

    if (requiresEducationLevel(profile) && !educationLevel) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'validation.signup.educationLevelRequired',
        path: ['educationLevel']
      });
    }
  });

export type SignupFormInput = z.infer<typeof signupFormSchema>;
