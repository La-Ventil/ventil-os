import { canManageBadges, type AdminFlags } from '../authorization';
import { ActivityStatus, isActive } from '../activity-status';

export type OpenBadgeAssignmentContext = {
  userId?: string | null;
  admin?: AdminFlags | null;
  trainerThreshold: number | null;
  highestLevel: number | null;
  badgeStatus?: ActivityStatus | null;
};

export const canAssignOpenBadge = (context: OpenBadgeAssignmentContext): boolean => {
  if (context.badgeStatus != null && !isActive(context.badgeStatus)) {
    return false;
  }

  if (canManageBadges(context.admin)) {
    return true;
  }

  if (!context.userId) {
    return false;
  }

  if (context.trainerThreshold === null) {
    return false;
  }

  if (context.highestLevel === null) {
    return false;
  }

  return context.highestLevel >= context.trainerThreshold;
};
