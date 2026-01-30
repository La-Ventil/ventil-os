'use server';

import { awardOpenBadgeLevelUseCase, assignOpenBadgeFormInputSchema } from '@repo/application';
import type { FormState } from '@repo/ui/form-state';
import { getServerSession } from '../auth';

type AssignOpenBadgeInput = {
  userId: string;
  openBadgeId: string;
  level: number;
};

export async function assignOpenBadge(input: AssignOpenBadgeInput): Promise<FormState<AssignOpenBadgeInput>> {
  const session = await getServerSession();

  if (!session || !session.user?.id) {
    return {
      success: false,
      valid: true,
      message: 'Unauthorized',
      fieldErrors: {},
      values: input
    };
  }

  const parsed = assignOpenBadgeFormInputSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      valid: false,
      message: 'Invalid input',
      fieldErrors: parsed.error.flatten().fieldErrors,
      values: input
    };
  }

  await awardOpenBadgeLevelUseCase(parsed.data, {
    id: session.user.id,
    email: session.user.email ?? null,
    globalAdmin: session.user.globalAdmin,
    pedagogicalAdmin: session.user.pedagogicalAdmin
  });

  return {
    success: true,
    valid: true,
    message: 'Badge attribué',
    fieldErrors: {},
    values: parsed.data
  };
}
