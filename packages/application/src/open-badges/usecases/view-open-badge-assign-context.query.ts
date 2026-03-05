import type { OpenBadgeViewModel } from '@repo/view-models/open-badge';
import type { UserSummaryWithOpenBadgeLevelViewModel } from '@repo/view-models/user-summary';
import type { Query } from '../../usecase';
import { buildOpenBadgeAssignableUsersByBadgeIdAndLevel } from './open-badge-assignment-options.query';
import { browseAssignableUsersForOpenBadge } from './browse-assignable-users-for-open-badge.query';
import { viewOpenBadge } from './view-open-badge.query';

export type OpenBadgeAssignContext = {
  openBadge: OpenBadgeViewModel;
  users: UserSummaryWithOpenBadgeLevelViewModel[];
  userIdsByOpenBadgeIdAndLevel: Record<string, Record<string, string[]>>;
};

export const viewOpenBadgeAssignContext: Query<[string], OpenBadgeAssignContext | null> = async (
  openBadgeId: string
) => {
  const openBadge = await viewOpenBadge(openBadgeId);
  if (!openBadge) {
    return null;
  }

  const users = await browseAssignableUsersForOpenBadge(openBadgeId);
  const userIdsByOpenBadgeIdAndLevel = await buildOpenBadgeAssignableUsersByBadgeIdAndLevel([openBadge], users);

  return {
    openBadge,
    users,
    userIdsByOpenBadgeIdAndLevel
  };
};
