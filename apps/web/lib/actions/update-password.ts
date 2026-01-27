'use server';

import { getTranslations } from 'next-intl/server';
import { findUserByValidResetToken, updateUserPassword } from '@repo/application';
import { UpdatePasswordFormInput, updatePasswordFormSchema } from '@repo/application/forms';
import { FormState } from '@repo/ui/form-state';
import { hashSecret } from '../security';
import { zodErrorToFieldErrors, fieldErrorsToSingleMessage } from '../validation';

export type UpdatePasswordActionValues = UpdatePasswordFormInput & {
  email?: string;
};

export type UpdatePasswordActionState = FormState<UpdatePasswordActionValues> & {
  token: string;
};

export async function updatePassword(
  previousState: UpdatePasswordActionState,
  formData: FormData
): Promise<UpdatePasswordActionState> {
  const t = await getTranslations();
  const { success, data, error } = updatePasswordFormSchema.safeParse(formData);

  try {
    if (!success) {
      const fieldErrors = zodErrorToFieldErrors(error, t);
      const values = Object.fromEntries(formData) as unknown as UpdatePasswordActionValues;
      return {
        token: previousState.token,
        message: fieldErrorsToSingleMessage(fieldErrors, { maxMessages: 1 }),
        isValid: false,
        fieldErrors,
        values
      };
    }

    const updatePasswordFormData: UpdatePasswordFormInput = data;

    const user = await findUserByValidResetToken(previousState.token);

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

    const { salt, hashedSecret, iterations } = await hashSecret(updatePasswordFormData.password);

    await updateUserPassword(user.id, {
      password: hashedSecret,
      salt,
      iterations
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
        password: '',
        passwordConfirmation: ''
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
