import { openBadgeRepository } from '@repo/db';
import { canAssignOpenBadge as canAssignOpenBadgePolicy } from '@repo/domain/badge/open-badge-assignment-policy';
import type { Query } from '../../usecase';

export type OpenBadgeAssigner = {
  id?: string;
  email?: string | null;
  globalAdmin?: boolean;
  pedagogicalAdmin?: boolean;
} | null;

export const canAssignOpenBadge: Query<[string, OpenBadgeAssigner?], boolean> = async (
  openBadgeId: string,
  user?: OpenBadgeAssigner
) => {
  const trainerThreshold = await openBadgeRepository.getTrainerThresholdLevel(openBadgeId);
  const highestLevel = user?.id
    ? await openBadgeRepository.getUserHighestOpenBadgeLevel(user.id, openBadgeId)
    : null;

  return canAssignOpenBadgePolicy({
    userId: user?.id,
    admin: user ?? null,
    trainerThreshold,
    highestLevel
  });
};
