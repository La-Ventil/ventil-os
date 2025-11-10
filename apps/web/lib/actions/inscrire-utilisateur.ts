'use server';

import { nanoid } from 'nanoid';
import { prismaClient, Prisma, Profil, ConsentementType } from '@repo/db';
import { InscriptionFormData, inscriptionFormDataSchema } from '@repo/domain/models/forms/inscription-form-data';
import { isValidationError, zodErrorToMessage } from '../validation';
import { hashSecret } from '../security';

export async function inscrireUtilisateur(previousState, formData: FormData) {
  const values = {
    email: formData.get('email'),
    motDePasse: formData.get('motDePasse')
  };
  try {
    console.log(formData);
    console.log(formData.get('prenom'));
    const inscriptionFormData: InscriptionFormData = inscriptionFormDataSchema.parse(formData);

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
      message: 'Inscription réussie !',
      isValid: true,
      fieldErrors: []
    };
  } catch (e) {
    console.error(e);
    let message = 'Une erreur inattendu est survenue :(';
    if (isValidationError(e)) {
      message = zodErrorToMessage(e);
    }

    return { message, isValid: false, fieldErrors: [], values };
  }
}
