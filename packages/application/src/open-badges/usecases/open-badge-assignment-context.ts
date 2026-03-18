import { openBadgeRepository } from '@repo/db';
import type {
  OpenBadgeAssignmentContextReadModel,
  OpenBadgeAssignmentPolicyContextReadModel
} from '@repo/db/read-models';
import { canAssignOpenBadge as canAssignOpenBadgePolicy } from '@repo/domain/badge/open-badge-assignment-policy';

export type OpenBadgeAssigner = {
  id?: string;
  email?: string | null;
  globalAdmin?: boolean;
  pedagogicalAdmin?: boolean;
} | null;

export type OpenBadgeAssignmentContext = OpenBadgeAssignmentContextReadModel;

export const loadOpenBadgeAssignmentContext = async (
  openBadgeId: string,
  user?: OpenBadgeAssigner
): Promise<OpenBadgeAssignmentContext | null> => {
  const context = await openBadgeRepository.getOpenBadgeAssignmentContext(openBadgeId, user?.id);
  if (!context) {
    return null;
  }

  return context;
};

export const loadOpenBadgeAssignmentPolicyContext = async (
  openBadgeId: string,
  user?: OpenBadgeAssigner
): Promise<OpenBadgeAssignmentPolicyContextReadModel | null> =>
  openBadgeRepository.getOpenBadgeAssignmentPolicyContext(openBadgeId, user?.id);

export const canAssignOpenBadgeFromContext = (context: OpenBadgeAssignmentContext, user?: OpenBadgeAssigner): boolean =>
  canAssignOpenBadgePolicy({
    badgeStatus: context.badge.status,
    userId: user?.id,
    admin: user ?? null,
    trainerThreshold: context.trainerThreshold,
    highestLevel: context.highestLevel
  });

export const canAssignOpenBadgeFromPolicyContext = (
  context: OpenBadgeAssignmentPolicyContextReadModel,
  user?: OpenBadgeAssigner
): boolean =>
  canAssignOpenBadgePolicy({
    badgeStatus: context.status,
    userId: user?.id,
    admin: user ?? null,
    trainerThreshold: context.trainerThreshold,
    highestLevel: context.highestLevel
  });
