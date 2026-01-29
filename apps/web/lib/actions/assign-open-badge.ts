'use server';

import {
  awardOpenBadgeLevel,
  canManageBadgesUser,
  getUserProfileByEmail,
  assignOpenBadgeFormInputSchema
} from '@repo/application';
import { getServerSession } from '../auth';

type AssignOpenBadgeInput = {
  userId: string;
  openBadgeId: string;
  level: number;
};

export async function assignOpenBadge(input: AssignOpenBadgeInput) {
  const session = await getServerSession();

  if (!session || !session.user?.id || !canManageBadgesUser(session.user)) {
    throw new Error('Unauthorized');
  }

  const parsed = assignOpenBadgeFormInputSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error('Invalid input');
  }

  const awarder = session.user.email ? await getUserProfileByEmail(session.user.email) : null;

  if (!awarder) {
    throw new Error('Awarding user not found');
  }

  await awardOpenBadgeLevel({
    userId: parsed.data.userId,
    openBadgeId: parsed.data.openBadgeId,
    level: parsed.data.level,
    awardedById: awarder.id
  });

  return { ok: true };
}
