'use server';

import { getTranslations } from 'next-intl/server';
import { registerUserAccount } from '@repo/application';
import { hashSecret } from '@repo/crypto';
import { SignupFormInput, signupFormSchema } from '@repo/application/forms';
import { FormState } from '@repo/ui/form-state';
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
        success: false,
        valid: false,
        isValid: false,
        message: fieldErrorsToSingleMessage(fieldErrors),
        fieldErrors,
        values
      };
    }

    const signupFormData: SignupFormInput = data;
    const { salt, hashedSecret, iterations } = await hashSecret(signupFormData.password);
    const result = await registerUserAccount({
      email: signupFormData.email,
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
        email: [t('validation.emailAlreadyUsed')]
      };

      return {
        success: false,
        valid: true,
        isValid: false,
        message: fieldErrorsToSingleMessage(fieldErrors),
        fieldErrors,
        values
      };
    }

    return {
      success: true,
      valid: true,
      isValid: true,
      values,
      message: t('signup.success'),
      fieldErrors: {}
    };
  } catch (e) {
    console.error(e);
    return {
      success: false,
      valid: true,
      isValid: false,
      message: t('signup.error'),
      fieldErrors: {},
      values
    };
  }
}
