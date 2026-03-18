import type { Query } from '../../usecase';
import {
  canAssignOpenBadgeFromPolicyContext,
  loadOpenBadgeAssignmentPolicyContext,
  type OpenBadgeAssigner
} from './open-badge-assignment-context';

export type { OpenBadgeAssigner } from './open-badge-assignment-context';

export const canAssignOpenBadge: Query<[string, OpenBadgeAssigner?], boolean> = async (
  openBadgeId: string,
  user?: OpenBadgeAssigner
) => {
  const context = await loadOpenBadgeAssignmentPolicyContext(openBadgeId, user);
  if (!context) {
    return false;
  }

  return canAssignOpenBadgeFromPolicyContext(context, user);
};
