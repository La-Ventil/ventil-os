import type { Query } from '../../usecase';
import {
  canAssignOpenBadgeFromContext,
  loadOpenBadgeAssignmentContext,
  type OpenBadgeAssigner
} from './open-badge-assignment-context';

export type { OpenBadgeAssigner } from './open-badge-assignment-context';

export const canAssignOpenBadge: Query<[string, OpenBadgeAssigner?], boolean> = async (
  openBadgeId: string,
  user?: OpenBadgeAssigner
) => {
  const context = await loadOpenBadgeAssignmentContext(openBadgeId, user);
  if (!context) {
    return false;
  }

  return canAssignOpenBadgeFromContext(context, user);
};
