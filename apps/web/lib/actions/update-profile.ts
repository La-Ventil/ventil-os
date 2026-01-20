'use server';

import { getTranslations } from 'next-intl/server';
import { prismaClient, Prisma } from '@repo/db';
import { ProfileFormData, profileFormDataSchema } from '@repo/domain/models/forms/profile-form-data';
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
    let userUpdateInput: Prisma.UserUpdateInput = {
      name: profileFormData.lastName,
      prenom: profileFormData.firstName,
      nom: profileFormData.lastName,
      niveauScolaire: profileFormData.educationLevel
    };
    await prismaClient.user.update({
      where: { id: userProfile.id },
      data: userUpdateInput
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
