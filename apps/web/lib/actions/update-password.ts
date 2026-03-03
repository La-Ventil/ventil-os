'use server';

import { getTranslations } from 'next-intl/server';
import { resetPassword } from '@repo/application/users/usecases';
import { UpdatePasswordFormInput, updatePasswordFormSchema } from '@repo/application/forms';
import { FormState } from '@repo/form/form-state';
import { zodErrorToFieldErrors } from '../validation';
import { fieldErrorsToMessage } from '@repo/form/form-feedback';
import { formError, formSuccess, formValidationError } from '@repo/form/form-state-builders';

export type UpdatePasswordActionValues = UpdatePasswordFormInput & {
  email?: string;
};

export type UpdatePasswordActionState = FormState<UpdatePasswordActionValues> & {
  token: string;
};

export async function updatePasswordAction(
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
        fieldErrorsToMessage(fieldErrors, { maxMessages: 1 }),
        { token: previousState.token }
      );
    }

    const updatePasswordFormData: UpdatePasswordFormInput = data;

    const result = await resetPassword(previousState.token, updatePasswordFormData.password);

    if (!result.ok) {
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

    return formSuccess(
      {
        email: result.email,
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
