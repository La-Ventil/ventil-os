'use server';

import { getTranslations } from 'next-intl/server';
import { updateUserProfile } from '@repo/application';
import { ProfileFormInput, profileFormSchema } from '@repo/application/forms';
import { FormState } from '@repo/form/form-state';
import { requiresEducationLevel } from '@repo/domain/profile-type';
import { getUserProfileFromSession } from '../auth';
import { fieldErrorsToSingleMessage, zodErrorToFieldErrors } from '../validation';

export async function updateProfile(
  previousState: FormState<ProfileFormInput>,
  formData: FormData
): Promise<FormState<ProfileFormInput>> {
  const t = await getTranslations();
  const { success, data, error } = profileFormSchema.safeParse(formData);
  const values = Object.fromEntries(formData) as unknown as ProfileFormInput;
  try {
    if (!success) {
      const fieldErrors = zodErrorToFieldErrors(error, t);
      return {
        success: false,
        valid: false,
        message: fieldErrorsToSingleMessage(fieldErrors),
        fieldErrors,
        values
      };
    }

    const userProfile = await getUserProfileFromSession();

    const profileFormData: ProfileFormInput = data;
    if (requiresEducationLevel(userProfile.profile) && !profileFormData.educationLevel) {
      const fieldErrors = {
        educationLevel: [t('validation.profile.educationLevelRequired')]
      };

      return {
        success: false,
        valid: false,
        message: fieldErrorsToSingleMessage(fieldErrors),
        fieldErrors,
        values
      };
    }
    await updateUserProfile(userProfile.id, {
      firstName: profileFormData.firstName,
      lastName: profileFormData.lastName,
      educationLevel: profileFormData.educationLevel
    });

    return {
      success: true,
      valid: true,
      values,
      message: t('forms.messages.profileUpdated'),
      fieldErrors: {}
    };
  } catch (e) {
    console.error(e);
    return {
      success: false,
      valid: true,
      message: t('validation.genericError'),
      fieldErrors: {},
      values
    };
  }
}
