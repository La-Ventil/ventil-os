'use server';

import { getTranslations } from 'next-intl/server';
import { prismaClient } from '@repo/db';
import {
  UpdatePasswordFormData,
  updatePasswordFormDataSchema
} from '@repo/domain/models/forms/update-password-form-data';
import { FormState } from '@repo/ui/form-state';
import { zodErrorToFieldErrors, fieldErrorsToSingleMessage } from '../validation';
import { hashSecret } from '../security';

export type UpdatePasswordActionState = FormState<UpdatePasswordFormData> & {
  token: string;
};

export async function updatePassword(
  previousState: UpdatePasswordActionState,
  formData: FormData
): Promise<UpdatePasswordActionState> {
  const t = await getTranslations();
  const { success, data, error } = updatePasswordFormDataSchema.safeParse(formData);

  try {
    if (!success) {
      const fieldErrors = zodErrorToFieldErrors(error, t);
      const values = Object.fromEntries(formData) as unknown as UpdatePasswordFormData;
      return {
        token: previousState.token,
        message: fieldErrorsToSingleMessage(fieldErrors, { maxMessages: 1 }),
        isValid: false,
        fieldErrors,
        values
      };
    }

    const updatePasswordFormData: UpdatePasswordFormData = data;

    const user = await prismaClient.user.findFirst({
      where: {
        resetToken: { equals: previousState.token },
        resetTokenExpiry: { gte: new Date() }
      }
    });

    if (!user) {
      return {
        token: previousState.token,
        message: t('updatePassword.invalidToken', {
          defaultMessage: "Ce lien de réinitialisation n'existe pas ou n'est plus valide."
        }),
        isValid: false,
        fieldErrors: {},
        values: previousState.values
      };
    }

    const { salt, hashedSecret, iterations } = await hashSecret(updatePasswordFormData.motDePasse);

    await prismaClient.user.update({
      where: { id: user.id },
      data: {
        resetToken: null,
        resetTokenExpiry: null,
        password: hashedSecret,
        salt,
        iterations
      }
    });

    return {
      token: previousState.token,
      message: t('updatePassword.success', {
        defaultMessage: 'Votre mot de passe a bien été changé.'
      }),
      isValid: true,
      fieldErrors: {},
      values: {
        email: user.email,
        motDePasse: '',
        confirmationMotDePasse: ''
      }
    };
  } catch (err) {
    console.error(err);

    const fallback = t('validation.genericError');

    return {
      token: previousState.token,
      message: fallback,
      isValid: false,
      fieldErrors: {},
      values: previousState.values
    };
  }
}
