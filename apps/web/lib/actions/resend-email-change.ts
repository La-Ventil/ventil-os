 'use server';

import { getTranslations } from 'next-intl/server';
import { resendEmailChangeVerification } from '@repo/application';
import type { FormState } from '@repo/form/form-state';
import { getUserProfileFromSession } from '../auth';
import { sendEmailVerification } from '../email';
import { formError, formSuccess } from '@repo/form/form-state-builders';

type EmptyForm = Record<string, never>;

export async function resendEmailChange(
  previousState: FormState<EmptyForm>,
  formData: FormData
): Promise<FormState<EmptyForm>> {
  void formData;
  const t = await getTranslations();
  const userProfile = await getUserProfileFromSession();
  const result = await resendEmailChangeVerification(userProfile.id);

  if (!result.ok) {
    return formError(previousState.values, {
      message: t('forms.messages.emailVerificationNotPending')
    });
  }

  await sendEmailVerification({
    email: result.email,
    firstName: userProfile.firstName,
    lastName: userProfile.lastName,
    token: result.token,
    t
  });

  return formSuccess(previousState.values, t('forms.messages.emailVerificationSent'));
}
