'use server';

import { getTranslations } from 'next-intl/server';
import { changePasswordFormSchema, type ChangePasswordFormInput } from '@repo/application/forms';
import { getUserCredentialsByEmail, updateUserPassword } from '@repo/application';
import { hashSecret, verifySecret } from '@repo/crypto';
import type { FormState } from '@repo/form/form-state';
import { fieldErrorsToSingleMessage, zodErrorToFieldErrors } from '../validation';
import { getUserProfileFromSession } from '../auth';

export async function changePassword(
  previousState: FormState<ChangePasswordFormInput>,
  formData: FormData
): Promise<FormState<ChangePasswordFormInput>> {
  const t = await getTranslations();
  const { success, data, error } = changePasswordFormSchema.safeParse(formData);
  const values = Object.fromEntries(formData) as unknown as ChangePasswordFormInput;

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

  const { salt, hashedSecret, iterations } = await hashSecret(data.password);

  await updateUserPassword(credentials.id, {
    password: hashedSecret,
    salt,
    iterations
  });

  return {
    success: true,
    valid: true,
    message: t('forms.messages.passwordUpdated'),
    fieldErrors: {},
    values: {
      currentPassword: '',
      password: '',
      passwordConfirmation: ''
    }
  };
}
