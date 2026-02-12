'use server';

import nodemailer from 'nodemailer';

export type MailAddress = {
  email: string;
  name?: string;
};

export type SendTransactionalEmailInput = {
  to: MailAddress[];
  subject: string;
  text: string;
};

const resolveBaseUrlHost = () => {
  try {
    const baseUrl = process.env.BASE_URL ?? 'http://localhost:3000';
    return new URL(baseUrl).hostname;
  } catch {
    return 'localhost';
  }
};

const resolveFromAddress = () => {
  const appName = process.env.APP_NAME ?? 'VentilOS';
  const fallbackEmail = `no-reply@${resolveBaseUrlHost()}`;
  return {
    name: appName,
    email: process.env.EMAIL_FROM ?? fallbackEmail
  };
};

const resolveSmtpConfig = () => {
  const isProd = process.env.NODE_ENV === 'production';
  const host = process.env.SMTP_HOST ?? (isProd ? undefined : 'localhost');
  const port = Number(process.env.SMTP_PORT ?? (isProd ? undefined : 1025));

  if (!host || !Number.isFinite(port)) {
    throw new Error('SMTP_HOST and SMTP_PORT must be set to send emails.');
  }

  const secure = process.env.SMTP_SECURE ? process.env.SMTP_SECURE === 'true' : port === 465;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if ((user && !pass) || (!user && pass)) {
    throw new Error('SMTP_USER and SMTP_PASS must be set together.');
  }

  return {
    host,
    port,
    secure,
    auth: user ? { user, pass: pass as string } : undefined
  };
};

let transporter: nodemailer.Transporter | null = null;

const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport(resolveSmtpConfig());
  }
  return transporter;
};

export const sendTransactionalEmail = async ({ to, subject, text }: SendTransactionalEmailInput) => {
  const from = resolveFromAddress();
  const mailer = getTransporter();
  const toRecipients = to.map((recipient) =>
    recipient.name ? { name: recipient.name, address: recipient.email } : recipient.email
  );

  await mailer.sendMail({
    from: {
      name: from.name,
      address: from.email
    },
    to: toRecipients,
    subject,
    text
  });
};
