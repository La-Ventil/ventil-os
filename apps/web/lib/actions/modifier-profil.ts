'use server';

import { getTranslations } from 'next-intl/server';
import { prismaClient, Prisma } from '@repo/db';
import { ProfilFormData, profilFormDataSchema } from '@repo/domain/models/forms/profil-form-data';
import { FormState } from '@repo/ui/form-state';
import { getProfilUtilisateurFromSession } from '../auth';
import { fieldErrorsToSingleMessage, zodErrorToFieldErrors } from '../validation';

export async function modifierProfil(
  previousState: FormState<ProfilFormData>,
  formData: FormData
): Promise<FormState<ProfilFormData>> {
  const t = await getTranslations();
  const { success, data, error } = profilFormDataSchema.safeParse(formData);
  const values = Object.fromEntries(formData) as unknown as ProfilFormData;
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

    const profilUtilisateur = await getProfilUtilisateurFromSession();

    const profilFormData: ProfilFormData = data;
    let userUpdateInput: Prisma.UserUpdateInput = {
      name: profilFormData.nom,
      prenom: profilFormData.prenom,
      nom: profilFormData.nom,
      niveauScolaire: profilFormData.niveauScolaire
    };
    await prismaClient.user.update({
      where: { id: profilUtilisateur.id },
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
