'use server';

import { nanoid } from 'nanoid';
import { prismaClient } from '@repo/db';
import { TransactionalEmailsApi, SendSmtpEmail, TransactionalEmailsApiApiKeys } from '@getbrevo/brevo';
import { isValidationError, zodErrorToMessage } from '../validation';
import { ResetPasswordFormData, resetPasswordFormDataSchema } from '@repo/domain/models/forms/reset-password-form-data';

export async function resetPassword(previousState, formData: FormData) {
  try {
    const resetPasswordFormData: ResetPasswordFormData = resetPasswordFormDataSchema.parse(formData);
    const resetToken = nanoid() as string;
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour expiry
    const user = await prismaClient.user.findUnique({
      where: {
        email: resetPasswordFormData.email
      }
    });

    if (user) {
      await prismaClient.user.update({
        data: {
          resetToken,
          resetTokenExpiry
        },
        where: {
          id: user.id
        }
      });

      const emailAPI = new TransactionalEmailsApi();
      (emailAPI as any).authentications.apiKey.apiKey = process.env.BREVO_API_KEY;
      emailAPI.setApiKey(TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);

      const message = new SendSmtpEmail();
      message.subject = `[${process.env.APP_NAME}] Réinitialisation de votre mot de passe`;
      message.textContent = `Bonjour ${user.prenom}!
    Voici le lien permettant de mettre à jour votre mot de passe :
    ${new URL(`/update-password/${resetToken}`, process.env.BASE_URL).toString()}
    `;
      message.sender = { name: process.env.APP_NAME, email: 'no-reply@laventil.org' };
      message.to = [{ email: user.email, name: `${user.prenom} ${user.name}` }];

      console.log(message);
      const { body } = await emailAPI.sendTransacEmail(message);
      console.log(JSON.stringify(body));
    }

    return {
      message:
        'Si votre email existe dans notre base de donnée, un email permettant de changer de mot de passe vous a été envoyé.',
      isValid: true,
      fieldErrors: []
    };
  } catch (e) {
    console.error(e);
    let message = 'Une erreur inattendu est survenue :(';
    if (isValidationError(e)) {
      message = zodErrorToMessage(e);
    }

    return { message, isValid: false, fieldErrors: [] };
  }
}
