'use server';

import { getTranslations } from 'next-intl/server';
import { cancelEmailChange } from '@repo/application/users/usecases';
import type { FormState } from '@repo/form/form-state';
import { getUserProfileFromSession } from '../../auth';
import { formError, formSuccess } from '@repo/form/form-state-builders';

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
    return formError(previousState.values, {
      message: t('forms.messages.emailVerificationNotPending')
    });
  }

  return formSuccess(previousState.values, t('forms.messages.emailChangeCanceled'));
}
