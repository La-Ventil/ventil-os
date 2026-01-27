'use server';

import { getTranslations } from 'next-intl/server';
import { TransactionalEmailsApi, SendSmtpEmail, TransactionalEmailsApiApiKeys } from '@getbrevo/brevo';
import { nanoid } from 'nanoid';
import { findUserForPasswordReset, setUserResetToken } from '@repo/application';
import {
  ResetPasswordFormData,
  resetPasswordFormDataSchema
} from '@repo/application/forms/reset-password-form-data';
import { FormState } from '@repo/ui/form-state';
import { zodErrorToFieldErrors, fieldErrorsToSingleMessage } from '../validation';

export async function resetPassword(
  previousState: FormState<ResetPasswordFormData>,
  formData: FormData
): Promise<FormState<ResetPasswordFormData>> {
  const t = await getTranslations();
  const { success, data, error } = resetPasswordFormDataSchema.safeParse(formData);

  try {
    if (!success) {
      const fieldErrors = zodErrorToFieldErrors(error, t);
      const values = Object.fromEntries(formData) as unknown as ResetPasswordFormData;
      return {
        message: fieldErrorsToSingleMessage(fieldErrors, { maxMessages: 1 }),
        isValid: false,
        fieldErrors,
        values
      };
    }

    const { email } = data;
    const user = await findUserForPasswordReset(email);

    const okMessage = t('resetPassword.success');

    if (!user) {
      return { message: okMessage, isValid: true, fieldErrors: {}, values: { email } };
    }

    const resetToken = nanoid();
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1h

    await setUserResetToken(user.id, resetToken, resetTokenExpiry);

    const emailAPI = new TransactionalEmailsApi();
    emailAPI.setApiKey(TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY!);

    const resetUrl = new URL(`/update-password/${resetToken}`, process.env.BASE_URL).toString();

    const message = new SendSmtpEmail();
    const appName = process.env.APP_NAME!;

    message.subject = t('resetPassword.emailSubject', { appName });
    message.textContent = t('resetPassword.emailText', { name: user.firstName, resetUrl });
    message.sender = {
      name: appName,
      email: 'no-reply@laventil.org'
    };
    message.to = [
      {
        email: user.email,
        name: `${user.firstName} ${user.lastName}`
      }
    ];

    await emailAPI.sendTransacEmail(message);

    return { message: okMessage, isValid: true, fieldErrors: {}, values: { email } };
  } catch (err) {
    console.error(err);

    return { message: t('validation.genericError'), isValid: false, fieldErrors: {}, values: previousState.values };
  }
}
