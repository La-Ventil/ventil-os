'use server';

import { getTranslations } from 'next-intl/server';
import { changePasswordFormSchema, type ChangePasswordFormInput } from '@repo/application/forms';
import { changePassword } from '@repo/application/users/usecases';
import type { FormState } from '@repo/form/form-state';
import { zodErrorToFieldErrors } from '@repo/form/zod-errors';
import { fieldErrorsToMessage } from '@repo/form/form-feedback';
import { getUserProfileFromSession } from '../auth';
import { formError, formSuccess, formValidationError } from '@repo/form/form-state-builders';

export async function changePasswordAction(
  previousState: FormState<ChangePasswordFormInput>,
  formData: FormData
): Promise<FormState<ChangePasswordFormInput>> {
  const t = await getTranslations();
  const { success, data, error } = changePasswordFormSchema.safeParse(formData);
  const values = Object.fromEntries(formData) as unknown as ChangePasswordFormInput;

  if (!success) {
    const fieldErrors = zodErrorToFieldErrors(error, t);
    return formValidationError(values, fieldErrors, fieldErrorsToMessage(fieldErrors));
  }

  const userProfile = await getUserProfileFromSession();
  const result = await changePassword(userProfile.email, {
    currentPassword: data.currentPassword,
    newPassword: data.password
  });

  if (!result.ok) {
    if (result.reason === 'invalid-password') {
      const fieldErrors = {
        currentPassword: [t('validation.password.invalid')]
      };
      return formValidationError(values, fieldErrors, fieldErrorsToMessage(fieldErrors));
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
