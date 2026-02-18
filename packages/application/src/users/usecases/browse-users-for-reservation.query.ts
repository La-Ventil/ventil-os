import { userRepository } from '@repo/db';
import type { UserSummaryViewModel } from '@repo/view-models/user-summary';
import { mapUserSummaryToViewModel } from '../../presenters/user-summary';
import type { Query } from '../../usecase';

export const browseUsersForReservation: Query<[], UserSummaryViewModel[]> = async () => {
  const users = await userRepository.listUserSummaries();
  return users.map(mapUserSummaryToViewModel);
};
