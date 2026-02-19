import { userRepository } from '@repo/db';
import type { UserAdminViewModel } from '@repo/view-models/user-admin';
import { mapUserAdminToViewModel } from '../../presenters/user-admin';
import type { Query } from '../../usecase';

export const browseAssignableUsersForOpenBadge: Query<[string], UserAdminViewModel[]> = async (
  openBadgeId: string
) => {
  const users = await userRepository.listUsersEligibleForOpenBadgeAssignment(openBadgeId);
  return users.map(mapUserAdminToViewModel);
};
