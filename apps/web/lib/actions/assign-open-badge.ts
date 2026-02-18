'use server';

import { awardOpenBadgeLevelUseCase, assignOpenBadgeFormInputSchema } from '@repo/application';
import { getTranslations } from 'next-intl/server';
import type { FormState } from '@repo/form/form-state';
import { getServerSession } from '../auth';
import { formError, formSuccess, formValidationError } from '@repo/form/form-state-builders';

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

  await awardOpenBadgeLevelUseCase(parsed.data, {
    id: session.user.id,
    email: session.user.email ?? null,
    globalAdmin: session.user.globalAdmin,
    pedagogicalAdmin: session.user.pedagogicalAdmin
  });

  return formSuccess(
    parsed.data,
    t('pages.hub.admin.users.assignSuccess', { defaultMessage: 'Open badge assigned.' })
  );
}
