'use server';

import { getTranslations } from 'next-intl/server';
import { changeEmailFormSchema, type ChangeEmailFormInput } from '@repo/application/forms';
import { requestEmailChange } from '@repo/application/users/usecases';
import type { FormState } from '@repo/form/form-state';
import { zodErrorToFieldErrors } from '../validation';
import { fieldErrorsToMessage } from '@repo/form/form-feedback';
import { getUserProfileFromSession } from '../auth';
import { sendEmailVerification } from '../email';
import { formError, formSuccess, formValidationError } from '@repo/form/form-state-builders';
import { isUserError } from '@repo/domain/user/user-errors';

export async function updateEmailAction(
  previousState: FormState<ChangeEmailFormInput>,
  formData: FormData
): Promise<FormState<ChangeEmailFormInput>> {
  const t = await getTranslations();
  const { success, data, error } = changeEmailFormSchema.safeParse(formData);
  const values = Object.fromEntries(formData) as unknown as ChangeEmailFormInput;

  if (!success) {
    const fieldErrors = zodErrorToFieldErrors(error, t);
    return formValidationError(values, fieldErrors, fieldErrorsToMessage(fieldErrors));
  }

  const userProfile = await getUserProfileFromSession();
  let result: Awaited<ReturnType<typeof requestEmailChange>>;
  try {
    result = await requestEmailChange(userProfile.email, data.currentPassword, data.newEmail);
  } catch (error) {
    if (isUserError(error)) {
      return formError(values, { message: t(error.code) });
    }

    console.error(error);
    return formError(values, { message: t('validation.genericError') });
  }

  if (!result.ok) {
    if (result.reason === 'invalid-password') {
      const fieldErrors = {
        currentPassword: [t('validation.password.invalid')]
      };
      return formValidationError(values, fieldErrors, fieldErrorsToMessage(fieldErrors));
    }

    if (result.reason === 'email-already-used') {
      const fieldErrors = {
        newEmail: [t('validation.emailAlreadyUsed')]
      };
      return formValidationError(values, fieldErrors, fieldErrorsToMessage(fieldErrors));
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
