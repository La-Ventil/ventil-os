import type { OpenBadgeViewModel } from '@repo/application/view-models/open-badge';
import type { UserSummaryWithOpenBadgeLevelViewModel } from '@repo/application/view-models/user-summary';
import type { Query } from '../../usecase';
import { mapOpenBadgeToViewModel } from '../../presenters/open-badge';
import { buildOpenBadgeAssignableUsersByBadgeIdAndLevel } from './open-badge-assignment-options.query';
import { browseAssignableUsersForOpenBadge } from './browse-assignable-users-for-open-badge.query';
import {
  canAssignOpenBadgeFromContext,
  loadOpenBadgeAssignmentContext,
  type OpenBadgeAssigner
} from './open-badge-assignment-context';

export type OpenBadgeAssignContext = {
  openBadge: OpenBadgeViewModel;
  users: UserSummaryWithOpenBadgeLevelViewModel[];
  userIdsByOpenBadgeIdAndLevel: Record<string, Record<string, string[]>>;
};

export const viewOpenBadgeAssignContext: Query<[string, OpenBadgeAssigner?], OpenBadgeAssignContext | null> = async (
  openBadgeId: string,
  currentUser: OpenBadgeAssigner | null = null
) => {
  const assignmentContext = await loadOpenBadgeAssignmentContext(openBadgeId, currentUser ?? undefined);
  if (!assignmentContext) {
    return null;
  }

  if (!canAssignOpenBadgeFromContext(assignmentContext, currentUser ?? undefined)) {
    return null;
  }

  const mappedBadge: OpenBadgeViewModel = mapOpenBadgeToViewModel(assignmentContext.badge);
  const users = await browseAssignableUsersForOpenBadge(openBadgeId);
  const userIdsByOpenBadgeIdAndLevel = await buildOpenBadgeAssignableUsersByBadgeIdAndLevel([mappedBadge], users);

  return {
    openBadge: mappedBadge,
    users,
    userIdsByOpenBadgeIdAndLevel
  };
};
