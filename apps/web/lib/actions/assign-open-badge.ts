'use server';

import { assignOpenBadge as assignOpenBadgeUseCase, assignOpenBadgeFormInputSchema } from '@repo/application';
import { getTranslations } from 'next-intl/server';
import type { FormState } from '@repo/form/form-state';
import { getServerSession } from '../auth';
import { formError, formSuccess, formValidationError } from '@repo/form/form-state-builders';
import { isOpenBadgeError } from '@repo/domain/badge/open-badge-errors';

type AssignOpenBadgeInput = {
  userId: string;
  openBadgeId: string;
  level: number;
};

export async function assignOpenBadge(input: AssignOpenBadgeInput): Promise<FormState<AssignOpenBadgeInput>> {
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
    await assignOpenBadgeUseCase(parsed.data, {
      id: session.user.id,
      email: session.user.email ?? null,
      globalAdmin: session.user.globalAdmin,
      pedagogicalAdmin: session.user.pedagogicalAdmin
    });

    return formSuccess(
      parsed.data,
      t('pages.hub.admin.users.assignSuccess', { defaultMessage: 'Open badge assigned.' })
    );
  } catch (error) {
    if (isOpenBadgeError(error)) {
      return formError(parsed.data, { message: t(error.code) });
    }

    console.error(error);
    return formError(parsed.data, { message: t('validation.genericError') });
  }
}
