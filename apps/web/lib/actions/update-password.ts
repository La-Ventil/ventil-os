'use server';

import { getTranslations } from 'next-intl/server';
import { findUserByValidResetToken, updateUserPassword } from '@repo/application';
import { UpdatePasswordFormInput, updatePasswordFormSchema } from '@repo/application/forms';
import { FormState } from '@repo/form/form-state';
import { zodErrorToFieldErrors, fieldErrorsToSingleMessage } from '../validation';
import { formError, formSuccess, formValidationError } from '@repo/form/form-state-builders';

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
      return formValidationError(
        values,
        fieldErrors,
        fieldErrorsToSingleMessage(fieldErrors, { maxMessages: 1 }),
        { token: previousState.token }
      );
    }

    const updatePasswordFormData: UpdatePasswordFormInput = data;

    const user = await findUserByValidResetToken(previousState.token);

    if (!user) {
      return formError(
        previousState.values,
        {
          message: t('updatePassword.invalidToken', {
            defaultMessage: "Ce lien de réinitialisation n'existe pas ou n'est plus valide."
          })
        },
        { token: previousState.token }
      );
    }

    await updateUserPassword(user.id, updatePasswordFormData.password);

    return formSuccess(
      {
        email: user.email,
        password: '',
        passwordConfirmation: ''
      },
      t('updatePassword.success', {
        defaultMessage: 'Votre mot de passe a bien été changé.'
      }),
      { token: previousState.token }
    );
  } catch (err) {
    console.error(err);

    const fallback = t('validation.genericError');

    return formError(previousState.values, { message: fallback }, { token: previousState.token });
  }
}
