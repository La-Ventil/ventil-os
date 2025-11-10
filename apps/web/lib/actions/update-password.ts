'use server';

import {
  UpdatePasswordFormData,
  updatePasswordFormDataSchema
} from '@repo/domain/models/forms/update-password-form-data';
import { prismaClient } from '@repo/db';
import { isValidationError, zodErrorToMessage } from '../validation';
import { hashSecret } from '../security';

export async function updatePassword(previousState, formData: FormData) {
  try {
    console.log(previousState);
    const updatePasswordFormData: UpdatePasswordFormData = updatePasswordFormDataSchema.parse(formData);
    const user = await prismaClient.user.findFirst({
      where: {
        resetToken: {
          equals: previousState.token
        },
        resetTokenExpiry: {
          gte: new Date()
        }
      }
    });

    if (!user) {
      throw new Error(`Ce token n'existe pas ou n'est plus valide.`);
    }

    const { salt, hashedSecret, iterations } = await hashSecret(updatePasswordFormData.motDePasse);
    prismaClient.user.update({
      data: {
        resetToken: null,
        resetTokenExpiry: null,
        password: hashedSecret,
        salt,
        iterations
      },
      where: {
        id: user.id
      }
    });

    return {
      token: previousState.token,
      message: 'Votre mot de passe a bien été changé.',
      fieldErrors: [],
      values: {},
      isValid: true
    };
  } catch (e) {
    console.error(e);
    let message = 'Une erreur inattendu est survenue :(';
    if (isValidationError(e)) {
      message = zodErrorToMessage(e);
    }

    return { token: previousState.token, message, isValid: false, fieldErrors: [] };
  }
}
