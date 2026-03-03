'use server';

import { revalidatePath } from 'next/cache';
import { getTranslations } from 'next-intl/server';
import { setUserOpenBadgeLevel } from '@repo/application/open-badges/usecases';
import { assignOpenBadgeFormInputSchema } from '@repo/application/forms';
import { isOpenBadgeError } from '@repo/domain/badge/open-badge-errors';
import type { FormState } from '@repo/form/form-state';
import { formError, formSuccess, formValidationError } from '@repo/form/form-state-builders';
import { getServerSession } from '../../auth';

type SetUserOpenBadgeLevelInput = {
  userId: string;
  openBadgeId: string;
  level: number;
};

export async function setUserOpenBadgeLevelAction(
  input: SetUserOpenBadgeLevelInput
): Promise<FormState<SetUserOpenBadgeLevelInput>> {
  const t = await getTranslations();
  const session = await getServerSession();

  if (!session || !session.user?.id) {
    return formError(input, {
      message: t('validation.unauthorized', { defaultMessage: 'Unauthorized' })
    });
  }

  const parsed = assignOpenBadgeFormInputSchema.safeParse(input);
  if (!parsed.success) {
    return formValidationError(
      input,
      parsed.error.flatten().fieldErrors,
      t('validation.invalidInput', { defaultMessage: 'Invalid input' })
    );
  }

  try {
    await setUserOpenBadgeLevel(parsed.data, {
      id: session.user.id,
      email: session.user.email ?? null,
      globalAdmin: session.user.globalAdmin,
      pedagogicalAdmin: session.user.pedagogicalAdmin
    });

    revalidatePath('/hub/admin/users', 'layout');
    revalidatePath('/hub/open-badge', 'layout');

    return formSuccess(
      parsed.data,
      t('pages.hub.admin.users.badgeManagement.feedback.levelUpdated', {
        defaultMessage: 'Open badge level updated.'
      })
    );
  } catch (error) {
    if (isOpenBadgeError(error)) {
      return formError(parsed.data, { message: t(error.code) });
    }

    console.error(error);
    return formError(parsed.data, { message: t('validation.genericError') });
  }
}
