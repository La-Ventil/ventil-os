'use server';

import { getTranslations } from 'next-intl/server';
import { requestPasswordReset } from '@repo/application/users/usecases';
import { ResetPasswordFormInput, resetPasswordFormSchema } from '@repo/application/forms';
import { FormState } from '@repo/form/form-state';
import { zodErrorToFieldErrors } from '@repo/form/zod-errors';
import { fieldErrorsToMessage } from '@repo/form/form-feedback';
import { sendPasswordResetEmail } from '@repo/application/users/account-emails';
import { formError, formSuccess, formValidationError } from '@repo/form/form-state-builders';

export async function resetPasswordAction(
  previousState: FormState<ResetPasswordFormInput>,
  formData: FormData
): Promise<FormState<ResetPasswordFormInput>> {
  const t = await getTranslations();
  const { success, data, error } = resetPasswordFormSchema.safeParse(formData);

  try {
    if (!success) {
      const fieldErrors = zodErrorToFieldErrors(error, t);
      const values = Object.fromEntries(formData) as unknown as ResetPasswordFormInput;
      return formValidationError(values, fieldErrors, fieldErrorsToMessage(fieldErrors, { maxMessages: 1 }));
    }

    const { email } = data;
    const { user, resetToken } = await requestPasswordReset(email);

    const okMessage = t('resetPassword.success');

    if (!user || !resetToken) {
      return formSuccess({ email }, okMessage);
    }

    // Not awaited: waiting for the provider would make a known address answer measurably slower
    // than an unknown one, which is exactly what the uniform notice above refuses to say.
    void sendPasswordResetEmail({
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      token: resetToken,
      t
    }).catch((error) => {
      console.error('Password reset email could not be sent', error);
    });

    return formSuccess({ email }, okMessage);
  } catch (err) {
    console.error(err);

    return formError(previousState.values, { message: t('validation.genericError') });
  }
}
