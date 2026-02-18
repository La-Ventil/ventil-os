'use server';

import { getTranslations } from 'next-intl/server';
import { changeEmailFormSchema, type ChangeEmailFormInput } from '@repo/application/forms';
import { requestEmailChangeWithPassword } from '@repo/application';
import type { FormState } from '@repo/form/form-state';
import { fieldErrorsToSingleMessage, zodErrorToFieldErrors } from '../validation';
import { getUserProfileFromSession } from '../auth';
import { sendEmailVerification } from '../email';
import { formError, formSuccess, formValidationError } from '@repo/form/form-state-builders';

export async function updateEmail(
  previousState: FormState<ChangeEmailFormInput>,
  formData: FormData
): Promise<FormState<ChangeEmailFormInput>> {
  const t = await getTranslations();
  const { success, data, error } = changeEmailFormSchema.safeParse(formData);
  const values = Object.fromEntries(formData) as unknown as ChangeEmailFormInput;

  if (!success) {
    const fieldErrors = zodErrorToFieldErrors(error, t);
    return formValidationError(values, fieldErrors, fieldErrorsToSingleMessage(fieldErrors));
  }

  const userProfile = await getUserProfileFromSession();
  const result = await requestEmailChangeWithPassword(
    userProfile.email,
    data.currentPassword,
    data.newEmail
  );

  if (!result.ok) {
    if (result.reason === 'invalid-password') {
      const fieldErrors = {
        currentPassword: [t('validation.password.invalid')]
      };
      return formValidationError(values, fieldErrors, fieldErrorsToSingleMessage(fieldErrors));
    }

    if (result.reason === 'email-already-used') {
      const fieldErrors = {
        newEmail: [t('validation.emailAlreadyUsed')]
      };
      return formValidationError(values, fieldErrors, fieldErrorsToSingleMessage(fieldErrors));
    }

    return formError(values, { message: t('validation.genericError') });
  }

  await sendEmailVerification({
    email: result.email,
    firstName: userProfile.firstName,
    lastName: userProfile.lastName,
    token: result.token,
    t
  });

  return formSuccess(
    {
      newEmail: data.newEmail,
      newEmailConfirmation: '',
      currentPassword: ''
    },
    t('forms.messages.emailVerificationSent')
  );
}
