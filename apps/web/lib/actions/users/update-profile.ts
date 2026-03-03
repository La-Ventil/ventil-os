'use server';

import { getTranslations } from 'next-intl/server';
import { updateProfile } from '@repo/application/users/usecases';
import { ProfileFormInput, parseProfileFormInput } from '@repo/application/forms';
import { FormState } from '@repo/form/form-state';
import { getUserProfileFromSession } from '../../auth';
import { zodErrorToFieldErrors } from '@repo/form/zod-errors';
import { fieldErrorsToMessage } from '@repo/form/form-feedback';
import { formError, formSuccess, formValidationError } from '@repo/form/form-state-builders';

export async function updateProfileAction(
  previousState: FormState<ProfileFormInput>,
  formData: FormData
): Promise<FormState<ProfileFormInput>> {
  const t = await getTranslations();
  const userProfile = await getUserProfileFromSession();
  const { success, data, error } = parseProfileFormInput(formData, userProfile.profile);
  const values = Object.fromEntries(formData) as unknown as ProfileFormInput;
  try {
    if (!success) {
      const fieldErrors = zodErrorToFieldErrors(error, t);
      return formValidationError(values, fieldErrors, fieldErrorsToMessage(fieldErrors));
    }

    const profileFormData: ProfileFormInput = data;
    await updateProfile(userProfile.id, {
      firstName: profileFormData.firstName,
      lastName: profileFormData.lastName,
      educationLevel: profileFormData.educationLevel
    });

    return formSuccess(values, t('forms.messages.profileUpdated'));
  } catch (e) {
    console.error(e);
    return formError(values, { message: t('validation.genericError') });
  }
}
