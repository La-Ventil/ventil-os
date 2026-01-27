'use server';

import { getTranslations } from 'next-intl/server';
import { updateUserProfile } from '@repo/application';
import { ProfileFormData, profileFormDataSchema } from '@repo/application/forms';
import { FormState } from '@repo/ui/form-state';
import { getUserProfileFromSession } from '../auth';
import { fieldErrorsToSingleMessage, zodErrorToFieldErrors } from '../validation';

export async function updateProfile(
  previousState: FormState<ProfileFormData>,
  formData: FormData
): Promise<FormState<ProfileFormData>> {
  const t = await getTranslations();
  const { success, data, error } = profileFormDataSchema.safeParse(formData);
  const values = Object.fromEntries(formData) as unknown as ProfileFormData;
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

    const userProfile = await getUserProfileFromSession();

    const profileFormData: ProfileFormData = data;
    await updateUserProfile(userProfile.id, {
      firstName: profileFormData.firstName,
      lastName: profileFormData.lastName,
      educationLevel: profileFormData.educationLevel
    });

    return {
      values,
      message: t('forms.messages.profileUpdated'),
      isValid: true,
      fieldErrors: {}
    };
  } catch (e) {
    console.error(e);
    return {
      message: t('validation.genericError'),
      isValid: false,
      fieldErrors: {},
      values
    };
  }
}
