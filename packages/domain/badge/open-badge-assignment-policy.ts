import { canManageBadges, type AdminFlags } from '../authorization';

export type OpenBadgeAssignmentContext = {
  userId?: string | null;
  admin?: AdminFlags | null;
  trainerThreshold: number | null;
  highestLevel: number | null;
};

export const canAssignOpenBadge = (context: OpenBadgeAssignmentContext): boolean => {
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
