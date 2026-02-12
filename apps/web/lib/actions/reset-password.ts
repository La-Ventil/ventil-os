'use server';

import { getTranslations } from 'next-intl/server';
import { requestPasswordReset } from '@repo/application';
import { ResetPasswordFormInput, resetPasswordFormSchema } from '@repo/application/forms';
import { FormState } from '@repo/form/form-state';
import { zodErrorToFieldErrors, fieldErrorsToSingleMessage } from '../validation';
import { sendPasswordResetEmail } from '../email';

export async function resetPassword(
  previousState: FormState<ResetPasswordFormInput>,
  formData: FormData
): Promise<FormState<ResetPasswordFormInput>> {
  const t = await getTranslations();
  const { success, data, error } = resetPasswordFormSchema.safeParse(formData);

  try {
    if (!success) {
      const fieldErrors = zodErrorToFieldErrors(error, t);
      const values = Object.fromEntries(formData) as unknown as ResetPasswordFormInput;
      return {
        success: false,
        valid: false,
        message: fieldErrorsToSingleMessage(fieldErrors, { maxMessages: 1 }),
        fieldErrors,
        values
      };
    }

    const { email } = data;
    const { user, resetToken } = await requestPasswordReset(email);

    const okMessage = t('resetPassword.success');

    if (!user || !resetToken) {
      return { success: true, valid: true, message: okMessage, fieldErrors: {}, values: { email } };
    }

    await sendPasswordResetEmail({
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      token: resetToken,
      t
    });

    return {
      success: true,
      valid: true,
      message: okMessage,
      fieldErrors: {},
      values: { email }
    };
  } catch (err) {
    console.error(err);

    return {
      success: false,
      valid: true,
      message: t('validation.genericError'),
      fieldErrors: {},
      values: previousState.values
    };
  }
}
