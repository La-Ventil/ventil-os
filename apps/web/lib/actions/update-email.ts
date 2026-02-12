'use server';

import { getTranslations } from 'next-intl/server';
import { changeEmailFormSchema, type ChangeEmailFormInput } from '@repo/application/forms';
import { getUserCredentialsByEmail, requestEmailChange } from '@repo/application';
import { verifySecret } from '@repo/crypto';
import type { FormState } from '@repo/form/form-state';
import { fieldErrorsToSingleMessage, zodErrorToFieldErrors } from '../validation';
import { getUserProfileFromSession } from '../auth';
import { sendEmailVerification } from '../email';

export async function updateEmail(
  previousState: FormState<ChangeEmailFormInput>,
  formData: FormData
): Promise<FormState<ChangeEmailFormInput>> {
  const t = await getTranslations();
  const { success, data, error } = changeEmailFormSchema.safeParse(formData);
  const values = Object.fromEntries(formData) as unknown as ChangeEmailFormInput;

  if (!success) {
    const fieldErrors = zodErrorToFieldErrors(error, t);
    return {
      success: false,
      valid: false,
      message: fieldErrorsToSingleMessage(fieldErrors),
      fieldErrors,
      values
    };
  }

  const userProfile = await getUserProfileFromSession();
  const credentials = await getUserCredentialsByEmail(userProfile.email);

  if (!credentials) {
    return {
      success: false,
      valid: true,
      message: t('validation.genericError'),
      fieldErrors: {},
      values
    };
  }

  const isValid = await verifySecret(
    data.currentPassword,
    credentials.password,
    credentials.salt,
    credentials.iterations
  );

  if (!isValid) {
    const fieldErrors = {
      currentPassword: [t('validation.password.invalid')]
    };
    return {
      success: false,
      valid: false,
      message: fieldErrorsToSingleMessage(fieldErrors),
      fieldErrors,
      values
    };
  }

  const result = await requestEmailChange(userProfile.id, data.newEmail);

  if (!result.ok) {
    const fieldErrors = {
      newEmail: [t('validation.emailAlreadyUsed')]
    };
    return {
      success: false,
      valid: false,
      message: fieldErrorsToSingleMessage(fieldErrors),
      fieldErrors,
      values
    };
  }

  await sendEmailVerification({
    email: result.email,
    firstName: userProfile.firstName,
    lastName: userProfile.lastName,
    token: result.token,
    t
  });

  return {
    success: true,
    valid: true,
    message: t('forms.messages.emailVerificationSent'),
    fieldErrors: {},
    values: {
      newEmail: data.newEmail,
      newEmailConfirmation: '',
      currentPassword: ''
    }
  };
}
