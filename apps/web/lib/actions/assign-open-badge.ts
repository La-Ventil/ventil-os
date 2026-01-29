'use server';

import { awardOpenBadgeLevel, canManageBadgesUser } from '@repo/application';
import { getServerSession } from '../auth';

type AssignOpenBadgeInput = {
  userId: string;
  openBadgeId: string;
  level: number;
};

export async function assignOpenBadge(input: AssignOpenBadgeInput) {
  const session = await getServerSession();

  if (!session || !canManageBadgesUser(session.user)) {
    throw new Error('Unauthorized');
  }

  if (!input.userId || !input.openBadgeId || !Number.isFinite(input.level)) {
    throw new Error('Invalid input');
  }

  await awardOpenBadgeLevel({
    userId: input.userId,
    openBadgeId: input.openBadgeId,
    level: input.level,
    awardedById: session.user.id
  });

  return { ok: true };
}
