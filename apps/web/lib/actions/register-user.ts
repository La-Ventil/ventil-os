'use server';

import { getTranslations } from 'next-intl/server';
import { nanoid } from 'nanoid';
import { registerUserAccount } from '@repo/application';
import { SignupFormInput, signupFormSchema } from '@repo/application/forms';
import { FormState } from '@repo/ui/form-state';
import { hashSecret } from '../security';
import { fieldErrorsToSingleMessage, zodErrorToFieldErrors } from '../validation';

export async function registerUser(
  previousState: FormState<SignupFormInput>,
  formData: FormData
): Promise<FormState<SignupFormInput>> {
  const t = await getTranslations();
  const { success, data, error } = signupFormSchema.safeParse(formData);
  const values = Object.fromEntries(formData) as unknown as SignupFormInput;
  try {
    if (!success) {
      const fieldErrors = zodErrorToFieldErrors(error, t);
      return {
        message: fieldErrorsToSingleMessage(fieldErrors),
        isValid: false,
        fieldErrors,
        values
      };
    }

    const signupFormData: SignupFormInput = data;
    const { salt, hashedSecret, iterations } = await hashSecret(signupFormData.password);
    const username = `${signupFormData.firstName}${signupFormData.lastName}#${nanoid()}`;
    const result = await registerUserAccount({
      email: signupFormData.email,
      username,
      firstName: signupFormData.firstName,
      lastName: signupFormData.lastName,
      educationLevel: signupFormData.educationLevel,
      profileType: signupFormData.profile,
      hashedSecret,
      salt,
      iterations,
      termsAccepted: signupFormData.terms === 'on'
    });

    if (!result.ok) {
      const fieldErrors = {
        email: [
          t('validation.emailAlreadyUsed', {
            defaultMessage: 'Cette adresse email est déjà utilisée.'
          })
        ]
      };

      return {
        message: fieldErrorsToSingleMessage(fieldErrors),
        isValid: false,
        fieldErrors,
        values
      };
    }

    return {
      values,
      message: t('signup.success'),
      isValid: true,
      fieldErrors: {}
    };
  } catch (e) {
    console.error(e);
    return {
      message: t('signup.error'),
      isValid: false,
      fieldErrors: {},
      values
    };
  }
}
