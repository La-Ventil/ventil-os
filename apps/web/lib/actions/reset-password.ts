'use server';

import { getTranslations } from 'next-intl/server';
import { TransactionalEmailsApi, SendSmtpEmail, TransactionalEmailsApiApiKeys } from '@getbrevo/brevo';
import { requestPasswordReset } from '@repo/application';
import { ResetPasswordFormInput, resetPasswordFormSchema } from '@repo/application/forms';
import { FormState } from '@repo/ui/form-state';
import { zodErrorToFieldErrors, fieldErrorsToSingleMessage } from '../validation';

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
        message: fieldErrorsToSingleMessage(fieldErrors, { maxMessages: 1 }),
        isValid: false,
        fieldErrors,
        values
      };
    }

    const { email } = data;
    const { user, resetToken } = await requestPasswordReset(email);

    const okMessage = t('resetPassword.success');

    if (!user || !resetToken) {
      return { message: okMessage, isValid: true, fieldErrors: {}, values: { email } };
    }

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
