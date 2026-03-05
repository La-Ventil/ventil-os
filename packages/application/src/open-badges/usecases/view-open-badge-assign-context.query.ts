import type { OpenBadgeViewModel } from '@repo/view-models/open-badge';
import type { UserSummaryWithOpenBadgeLevelViewModel } from '@repo/view-models/user-summary';
import { openBadgeRepository } from '@repo/db';
import { isActive } from '@repo/domain/activity-status';
import type { Query } from '../../usecase';
import { mapOpenBadgeToViewModel } from '../../presenters/open-badge';
import { buildOpenBadgeAssignableUsersByBadgeIdAndLevel } from './open-badge-assignment-options.query';
import { browseAssignableUsersForOpenBadge } from './browse-assignable-users-for-open-badge.query';
import { canAssignOpenBadge, type OpenBadgeAssigner } from './can-assign-open-badge.query';

export type OpenBadgeAssignContext = {
  openBadge: OpenBadgeViewModel;
  users: UserSummaryWithOpenBadgeLevelViewModel[];
  userIdsByOpenBadgeIdAndLevel: Record<string, Record<string, string[]>>;
};

export const viewOpenBadgeAssignContext: Query<[string, OpenBadgeAssigner?], OpenBadgeAssignContext | null> = async (
  openBadgeId: string,
  currentUser: OpenBadgeAssigner | null = null
) => {
  const openBadge = await openBadgeRepository.getOpenBadgeById(openBadgeId);
  if (!openBadge) {
    return null;
  }
  if (!isActive(openBadge.status)) {
    return null;
  }
  const canAssign = await canAssignOpenBadge(openBadgeId, currentUser ?? undefined);
  if (!canAssign) {
    return null;
  }

  const mappedBadge: OpenBadgeViewModel = mapOpenBadgeToViewModel(openBadge);
  const users = await browseAssignableUsersForOpenBadge(openBadgeId);
  const userIdsByOpenBadgeIdAndLevel = await buildOpenBadgeAssignableUsersByBadgeIdAndLevel([mappedBadge], users);

  return {
    openBadge: mappedBadge,
    users,
    userIdsByOpenBadgeIdAndLevel
  };
};
