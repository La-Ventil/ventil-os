'use server';

import { getTranslations } from 'next-intl/server';
import { validateSignIn } from '@repo/application/users/usecases';

export async function resolveSignInFailureMessageAction(email: string, password: string): Promise<string | null> {
  const t = await getTranslations('forms.messages');
  const result = await validateSignIn(email, password);

  switch (result.status) {
    case 'blocked':
      return t('signInBlocked');
    case 'unverified':
      return t('signInUnverified');
    case 'invalid':
      return t('signInFailed');
    case 'success':
      return null;
  }
}
