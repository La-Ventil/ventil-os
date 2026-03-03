'use server';

import { getTranslations } from 'next-intl/server';
import { canManageUsers } from '@repo/application';
import { updateProfile, viewUserProfileById } from '@repo/application/users/usecases';
import { parseProfileFormInput, type ProfileFormInput } from '@repo/application/forms';
import type { FormState } from '@repo/form/form-state';
import { zodErrorToFieldErrors } from '../validation';
import { fieldErrorsToMessage } from '@repo/form/form-feedback';
import { getServerSession } from '../auth';
import { formError, formSuccess, formValidationError } from '@repo/form/form-state-builders';

export async function updateUserProfileAction(
  previousState: FormState<ProfileFormInput>,
  formData: FormData
): Promise<FormState<ProfileFormInput>> {
  const t = await getTranslations();
  const session = await getServerSession();
  const userCanManageUsers = canManageUsers(session?.user);

  if (!session || !userCanManageUsers) {
    return formError(previousState.values, { message: t('user.update.unauthorized') });
  }

  const userId = formData.get('userId');
  if (typeof userId !== 'string') {
    return formError(previousState.values, { message: t('user.update.notFound') });
  }

  const userProfile = await viewUserProfileById(userId);
  if (!userProfile) {
    return formError(previousState.values, { message: t('user.update.notFound') });
  }

  const { success, data, error } = parseProfileFormInput(formData, userProfile.profile);
  const values = Object.fromEntries(formData) as unknown as ProfileFormInput;

  try {
    if (!success) {
      const fieldErrors = zodErrorToFieldErrors(error, t);
      return formValidationError(values, fieldErrors, fieldErrorsToMessage(fieldErrors));
    }

    const profileFormData: ProfileFormInput = data;
    await updateProfile(userId, {
      firstName: profileFormData.firstName,
      lastName: profileFormData.lastName,
      educationLevel: profileFormData.educationLevel
    });

    return formSuccess(values, t('user.update.success'));
  } catch (e) {
    console.error(e);
    return formError(values, { message: t('user.update.error') });
  }
}
