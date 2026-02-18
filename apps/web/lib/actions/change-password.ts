'use server';

import { getTranslations } from 'next-intl/server';
import { changePasswordFormSchema, type ChangePasswordFormInput } from '@repo/application/forms';
import { changeUserPassword } from '@repo/application';
import type { FormState } from '@repo/form/form-state';
import { fieldErrorsToSingleMessage, zodErrorToFieldErrors } from '../validation';
import { getUserProfileFromSession } from '../auth';
import { formError, formSuccess, formValidationError } from '@repo/form/form-state-builders';

export async function changePassword(
  previousState: FormState<ChangePasswordFormInput>,
  formData: FormData
): Promise<FormState<ChangePasswordFormInput>> {
  const t = await getTranslations();
  const { success, data, error } = changePasswordFormSchema.safeParse(formData);
  const values = Object.fromEntries(formData) as unknown as ChangePasswordFormInput;

  if (!success) {
    const fieldErrors = zodErrorToFieldErrors(error, t);
    return formValidationError(values, fieldErrors, fieldErrorsToSingleMessage(fieldErrors));
  }

  const userProfile = await getUserProfileFromSession();
  const result = await changeUserPassword(userProfile.email, {
    currentPassword: data.currentPassword,
    newPassword: data.password
  });

  if (!result.ok) {
    if (result.reason === 'invalid-password') {
      const fieldErrors = {
        currentPassword: [t('validation.password.invalid')]
      };
      return formValidationError(values, fieldErrors, fieldErrorsToSingleMessage(fieldErrors));
    }

    return formError(values, { message: t('validation.genericError') });
  }

  return formSuccess(
    {
      currentPassword: '',
      password: '',
      passwordConfirmation: ''
    },
    t('forms.messages.passwordUpdated')
  );
}
