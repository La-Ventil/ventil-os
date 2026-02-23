'use server';

import { getTranslations } from 'next-intl/server';
import { requestPasswordReset } from '@repo/application/users/usecases';
import { ResetPasswordFormInput, resetPasswordFormSchema } from '@repo/application/forms';
import { FormState } from '@repo/form/form-state';
import { zodErrorToFieldErrors, fieldErrorsToSingleMessage } from '../validation';
import { sendPasswordResetEmail } from '../email';
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
      return formValidationError(
        values,
        fieldErrors,
        fieldErrorsToSingleMessage(fieldErrors, { maxMessages: 1 })
      );
    }

    const { email } = data;
    const { user, resetToken } = await requestPasswordReset(email);

    const okMessage = t('resetPassword.success');

    if (!user || !resetToken) {
      return formSuccess({ email }, okMessage);
    }

    await sendPasswordResetEmail({
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      token: resetToken,
      t
    });

    return formSuccess({ email }, okMessage);
  } catch (err) {
    console.error(err);

    return formError(previousState.values, { message: t('validation.genericError') });
  }
}
