import { userRepository } from '@repo/db';
import type { UserSummaryWithOpenBadgeLevelViewModel } from '@repo/view-models/user-summary';
import { mapUserSummaryToViewModel } from '../../presenters/user-summary';
import type { Query } from '../../usecase';

export const browseAssignableUsersForOpenBadge: Query<[string], UserSummaryWithOpenBadgeLevelViewModel[]> = async (
  openBadgeId: string
) => {
  const users = await userRepository.listUsersEligibleForOpenBadgeAssignment(openBadgeId);
  return users.map((user) => ({
    ...mapUserSummaryToViewModel(user),
    currentOpenBadgeLevel: user.currentOpenBadgeLevel
  }));
};
