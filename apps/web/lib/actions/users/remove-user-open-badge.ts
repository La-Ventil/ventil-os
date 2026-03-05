'use server';

import { revalidatePath } from 'next/cache';
import { getTranslations } from 'next-intl/server';
import { removeOpenBadgeFromUser } from '@repo/application/open-badges/usecases';
import { assignOpenBadgeFormInputSchema } from '@repo/application/forms';
import type { FormState } from '@repo/form/form-state';
import { formError, formSuccess, formValidationError } from '@repo/form/form-state-builders';
import { getServerSession } from '../../auth';
import { withOpenBadgeFormError } from '../open-badges/open-badge-action-errors';

type RemoveUserOpenBadgeInput = {
  userId: string;
  openBadgeId: string;
};

export async function removeUserOpenBadgeAction(
  input: RemoveUserOpenBadgeInput
): Promise<FormState<RemoveUserOpenBadgeInput>> {
  const t = await getTranslations();
  const session = await getServerSession();

  if (!session || !session.user?.id) {
    return formError(input, {
      message: t('validation.unauthorized', { defaultMessage: 'Unauthorized' })
    });
  }

  const parsed = assignOpenBadgeFormInputSchema.pick({ userId: true, openBadgeId: true }).safeParse(input);

  if (!parsed.success) {
    return formValidationError(
      input,
      parsed.error.flatten().fieldErrors,
      t('validation.invalidInput', { defaultMessage: 'Invalid input' })
    );
  }

  try {
    await removeOpenBadgeFromUser(parsed.data, {
      id: session.user.id,
      email: session.user.email ?? null,
      globalAdmin: session.user.globalAdmin,
      pedagogicalAdmin: session.user.pedagogicalAdmin
    });

    revalidatePath('/hub/admin/users', 'layout');
    revalidatePath('/hub/open-badge', 'layout');

    return formSuccess(
      parsed.data,
      t('pages.hub.admin.users.badgeManagement.feedback.removed', {
        defaultMessage: 'Open badge removed.'
      })
    );
  } catch (error) {
    return withOpenBadgeFormError(parsed.data, error, t, 'validation.genericError');
  }
}
