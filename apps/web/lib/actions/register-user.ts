'use server';

import { getTranslations } from 'next-intl/server';
import { nanoid } from 'nanoid';
import { prismaClient, Prisma, Profil, ConsentementType, SousProfilEleve, SousProfilExterne } from '@repo/db';
import { SignupFormData, signupFormDataSchema } from '@repo/domain/models/forms/signup-form-data';
import { ProfileType } from '@repo/domain/profile-type';
import { FormState } from '@repo/ui/form-state';
import { hashSecret } from '../security';
import { fieldErrorsToSingleMessage, zodErrorToFieldErrors } from '../validation';

export async function registerUser(
  previousState: FormState<SignupFormData>,
  formData: FormData
): Promise<FormState<SignupFormData>> {
  const t = await getTranslations();
  const { success, data, error } = signupFormDataSchema.safeParse(formData);
  const values = Object.fromEntries(formData) as unknown as SignupFormData;
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

    const signupFormData: SignupFormData = data;
    const { salt, hashedSecret, iterations } = await hashSecret(signupFormData.password);
    let profil = Profil.eleve;
    let sousProfilEleve: SousProfilEleve | null = null;
    let sousProfilExterne: SousProfilExterne | null = null;

    switch (signupFormData.profile) {
      case ProfileType.Ventilacteur:
        profil = Profil.eleve;
        sousProfilEleve = SousProfilEleve.ventilacteur;
        break;
      case ProfileType.HighSchoolStudent:
        profil = Profil.eleve;
        sousProfilEleve = SousProfilEleve.visiteur;
        break;
      case ProfileType.Teacher:
        profil = Profil.enseignant;
        break;
      case ProfileType.Contributor:
        profil = Profil.personneExterne;
        sousProfilExterne = SousProfilExterne.intervenant;
        break;
      case ProfileType.Visitor:
        profil = Profil.personneExterne;
        sousProfilExterne = SousProfilExterne.visiteur;
        break;
      default:
        profil = Profil.eleve;
        sousProfilEleve = SousProfilEleve.visiteur;
    }

    let userCreateInput: Prisma.UserCreateInput = {
      name: signupFormData.lastName,
      email: signupFormData.email,
      pseudo: `${signupFormData.firstName}${signupFormData.lastName}#${nanoid()}`,
      prenom: signupFormData.firstName,
      nom: signupFormData.lastName,
      niveauScolaire: signupFormData.educationLevel,
      password: hashedSecret,
      salt,
      iterations,
      profil,
      sousProfilEleve,
      sousProfilExterne,
      // niveauScolaire?: string | null
      consentements: {
        create: {
          accepte: signupFormData.terms === 'on',
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
      message: t('signup.success'),
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
      message: t('signup.error'),
      isValid: false,
      fieldErrors: {},
      values
    };
  }
}
