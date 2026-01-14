'use server';

import { getTranslations } from 'next-intl/server';
import { nanoid } from 'nanoid';
import { prismaClient, Prisma, Profil, ConsentementType } from '@repo/db';
import { InscriptionFormData, inscriptionFormDataSchema } from '@repo/domain/models/forms/inscription-form-data';
import { FormState } from '@repo/ui/form-state';
import { hashSecret } from '../security';
import { fieldErrorsToSingleMessage, zodErrorToFieldErrors } from '../validation';

export async function inscrireUtilisateur(
  previousState: FormState<InscriptionFormData>,
  formData: FormData
): Promise<FormState<InscriptionFormData>> {
  const t = await getTranslations();
  const { success, data, error } = inscriptionFormDataSchema.safeParse(formData);
  const values = Object.fromEntries(formData) as unknown as InscriptionFormData;
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

console.log(data);

    const inscriptionFormData: InscriptionFormData = data;
    const { salt, hashedSecret, iterations } = await hashSecret(inscriptionFormData.motDePasse);
    let userCreateInput: Prisma.UserCreateInput = {
      name: inscriptionFormData.nom,
      email: inscriptionFormData.email,
      pseudo: `${inscriptionFormData.prenom}${inscriptionFormData.nom}#${nanoid()}`,
      prenom: inscriptionFormData.prenom,
      nom: inscriptionFormData.nom,
      niveauScolaire: inscriptionFormData.niveauScolaire,
      password: hashedSecret,
      salt,
      iterations,
      profil: Profil.eleve,
      // sousProfilEleve?: $Enums.SousProfilEleve | null
      // sousProfilExterne?: $Enums.SousProfilExterne | null
      // niveauScolaire?: string | null
      consentements: {
        create: {
          accepte: inscriptionFormData.cgu === 'on',
          accepteAt: new Date(),
          type: ConsentementType.cgu
        }
      }
    };
    await prismaClient.user.create({
      data: userCreateInput
    });

    return {
      values,
      message: t('inscription.success'),
      isValid: true,
      fieldErrors: {}
    };
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
      const fieldErrors = {
        email: [
          t('validation.emailAlreadyUsed', {
            defaultMessage: 'Cette adresse email est déjà utilisée.'
          })
        ]
      };

      return {
        message: fieldErrorsToSingleMessage(fieldErrors),
        isValid: false,
        fieldErrors,
        values
      };
    }

    console.error(e);
    return {
      message: t('inscription.error'),
      isValid: false,
      fieldErrors: {},
      values
    };
  }
}
