 'use server';

import { getTranslations } from 'next-intl/server';
import { cancelEmailChange } from '@repo/application';
import type { FormState } from '@repo/form/form-state';
import { getUserProfileFromSession } from '../auth';

type EmptyForm = Record<string, never>;

export async function cancelEmailChangeAction(
  previousState: FormState<EmptyForm>,
  formData: FormData
): Promise<FormState<EmptyForm>> {
  void formData;
  const t = await getTranslations();
  const userProfile = await getUserProfileFromSession();
  const result = await cancelEmailChange(userProfile.id);

  if (!result.ok) {
    return {
      ...previousState,
      success: false,
      valid: true,
      message: t('forms.messages.emailVerificationNotPending'),
      fieldErrors: {}
    };
  }

  return {
    ...previousState,
    success: true,
    valid: true,
    message: t('forms.messages.emailChangeCanceled'),
    fieldErrors: {}
  };
}
