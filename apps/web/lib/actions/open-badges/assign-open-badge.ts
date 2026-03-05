'use server';

import { revalidatePath } from 'next/cache';
import { assignOpenBadge } from '@repo/application/open-badges/usecases';
import { assignOpenBadgeFormInputSchema } from '@repo/application/forms';
import { getTranslations } from 'next-intl/server';
import type { FormState } from '@repo/form/form-state';
import { getServerSession } from '../../auth';
import { formError, formSuccess, formValidationError } from '@repo/form/form-state-builders';
import { withOpenBadgeFormError } from './open-badge-action-errors';

type AssignOpenBadgeInput = {
  userId: string;
  openBadgeId: string;
  level: number;
};

export async function assignOpenBadgeAction(input: AssignOpenBadgeInput): Promise<FormState<AssignOpenBadgeInput>> {
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
    await assignOpenBadge(parsed.data, {
      id: session.user.id,
      email: session.user.email ?? null,
      globalAdmin: session.user.globalAdmin,
      pedagogicalAdmin: session.user.pedagogicalAdmin
    });

    revalidatePath('/hub/admin/users', 'layout');
    revalidatePath('/hub/open-badge', 'layout');

    return formSuccess(
      parsed.data,
      t('pages.hub.admin.users.assignSuccess', { defaultMessage: 'Open badge assigned.' })
    );
  } catch (error) {
    return withOpenBadgeFormError(parsed.data, error, t, 'validation.genericError');
  }
}
