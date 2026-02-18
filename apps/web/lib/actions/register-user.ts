'use server';

import { getTranslations } from 'next-intl/server';
import { signUp } from '@repo/application';
import { SignupFormInput, signupFormSchema } from '@repo/application/forms';
import { FormState } from '@repo/form/form-state';
import { fieldErrorsToSingleMessage, zodErrorToFieldErrors } from '../validation';
import { sendEmailVerification } from '../email';
import { formDataToValues } from '@repo/form/form-data';
import { formError, formSuccess, formValidationError } from '@repo/form/form-state-builders';

export async function registerUser(
  previousState: FormState<SignupFormInput>,
  formData: FormData
): Promise<FormState<SignupFormInput>> {
  const t = await getTranslations();
  const { success, data, error } = signupFormSchema.safeParse(formData);
  const values = formDataToValues(formData, signupFormSchema);
  try {
    if (!success) {
      const fieldErrors = zodErrorToFieldErrors(error, t);
      return formValidationError(values, fieldErrors, fieldErrorsToSingleMessage(fieldErrors));
    }

    const signupFormData: SignupFormInput = data;
    const result = await signUp({
      email: signupFormData.email,
      firstName: signupFormData.firstName,
      lastName: signupFormData.lastName,
      educationLevel: signupFormData.educationLevel,
      profileType: signupFormData.profile,
      password: signupFormData.password,
      termsAccepted: signupFormData.terms === 'on'
    });

    if (!result.ok) {
      const fieldErrors = {
        email: [t('validation.emailAlreadyUsed')]
      };

      return formError(values, {
        message: fieldErrorsToSingleMessage(fieldErrors),
        fieldErrors
      });
    }

    const { token } = result;
    await sendEmailVerification({
      email: signupFormData.email,
      firstName: signupFormData.firstName,
      lastName: signupFormData.lastName,
      token,
      t
    });

    return formSuccess(values, t('signup.success'));
  } catch (e) {
    console.error(e);
    return formError(values, { message: t('signup.error') });
  }
}
