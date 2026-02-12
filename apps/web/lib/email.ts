'use server';

import { sendTransactionalEmail } from './mailer';

type EmailVerificationInput = {
  email: string;
  firstName: string;
  lastName?: string;
  token: string;
  t: (key: string, values?: Record<string, string>) => string;
};

export const sendEmailVerification = async ({ email, firstName, lastName, token, t }: EmailVerificationInput) => {
  const verifyUrl = new URL(`/verify-email/${token}`, process.env.BASE_URL);
  verifyUrl.searchParams.set('email', email);
  const fullName = [firstName, lastName].filter(Boolean).join(' ');
  const signature = t('emailSignature', { appName: process.env.APP_NAME ?? 'VentilOS' });
  const body = t('verifyEmail.emailText', { name: fullName, verifyUrl: verifyUrl.toString() });

  await sendTransactionalEmail({
    to: [
      {
        email,
        name: fullName
      }
    ],
    subject: t('verifyEmail.emailSubject', { appName: process.env.APP_NAME ?? 'VentilOS' }),
    text: `${body.trimEnd()}\n\n${signature}`
  });
};

type PasswordResetEmailInput = {
  email: string;
  firstName: string;
  lastName: string;
  token: string;
  t: (key: string, values?: Record<string, string>) => string;
};

export const sendPasswordResetEmail = async ({ email, firstName, lastName, token, t }: PasswordResetEmailInput) => {
  const resetUrl = new URL(`/update-password/${token}`, process.env.BASE_URL).toString();
  const signature = t('emailSignature', { appName: process.env.APP_NAME ?? 'VentilOS' });
  const body = t('resetPassword.emailText', { name: firstName, resetUrl });

  await sendTransactionalEmail({
    to: [
      {
        email,
        name: `${firstName} ${lastName}`
      }
    ],
    subject: t('resetPassword.emailSubject', { appName: process.env.APP_NAME ?? 'VentilOS' }),
    text: `${body.trimEnd()}\n\n${signature}`
  });
};
