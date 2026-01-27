import { z } from 'zod';
import { zfd } from 'zod-form-data';
import { emailSchema } from './email';
import { passwordConfirmationSchema, passwordSchema } from './password';

export const signupFormDataSchema = zfd
  .formData({
    firstName: z.string().min(1, { message: 'validation.signup.firstNameRequired' }),
    lastName: z.string().min(1, { message: 'validation.signup.lastNameRequired' }),
    email: emailSchema,
    password: passwordSchema,
    passwordConfirmation: passwordConfirmationSchema,
    profile: z.string().min(1, { message: 'validation.signup.profileRequired' }),
    terms: z.string().min(1, { message: 'validation.signup.termsRequired' }),
    educationLevel: z.string().min(1, { message: 'validation.signup.educationLevelRequired' })
  })
  .refine(({ password, passwordConfirmation }) => password === passwordConfirmation, {
    message: 'validation.password.confirmationMismatch',
    path: ['passwordConfirmation']
  });

export type SignupFormInput = z.infer<typeof signupFormDataSchema>;
