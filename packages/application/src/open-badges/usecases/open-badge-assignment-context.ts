import { openBadgeRepository } from '@repo/db';
import type { OpenBadgeReadModel } from '@repo/db/read-models';
import { canAssignOpenBadge as canAssignOpenBadgePolicy } from '@repo/domain/badge/open-badge-assignment-policy';
import type { ActivityStatus } from '@repo/domain/activity-status';

export type OpenBadgeAssigner = {
  id?: string;
  email?: string | null;
  globalAdmin?: boolean;
  pedagogicalAdmin?: boolean;
} | null;

type OpenBadgeAssignmentBadge = {
  id: string;
  status: ActivityStatus;
};

export type OpenBadgeAssignmentContext<TBadge extends OpenBadgeAssignmentBadge = OpenBadgeReadModel> = {
  badge: TBadge;
  trainerThreshold: number | null;
  highestLevel: number | null;
};

export const loadOpenBadgeAssignmentContext = async <TBadge extends OpenBadgeAssignmentBadge = OpenBadgeReadModel>(
  openBadgeId: string,
  user?: OpenBadgeAssigner,
  badge?: TBadge | null
): Promise<OpenBadgeAssignmentContext<TBadge> | null> => {
  const resolvedBadge = badge ?? ((await openBadgeRepository.getOpenBadgeById(openBadgeId)) as TBadge | null);
  if (!resolvedBadge) {
    return null;
  }

  const [trainerThreshold, highestLevel] = await Promise.all([
    openBadgeRepository.getTrainerThresholdLevel(openBadgeId),
    user?.id ? openBadgeRepository.getUserHighestOpenBadgeLevel(user.id, openBadgeId) : Promise.resolve(null)
  ]);

  return {
    badge: resolvedBadge,
    trainerThreshold,
    highestLevel
  };
};

export const canAssignOpenBadgeFromContext = (context: OpenBadgeAssignmentContext, user?: OpenBadgeAssigner): boolean =>
  canAssignOpenBadgePolicy({
    badgeStatus: context.badge.status,
    userId: user?.id,
    admin: user ?? null,
    trainerThreshold: context.trainerThreshold,
    highestLevel: context.highestLevel
  });
