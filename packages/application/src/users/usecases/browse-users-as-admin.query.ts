import { userRepository } from '@repo/db';
import type { UserAdminViewModel } from '@repo/view-models/user-admin';
import { mapUserAdminToViewModel } from '../../presenters/user-admin';
import type { Query } from '../../usecase';

export const browseUsersAsAdmin: Query<[], UserAdminViewModel[]> = async () => {
  const users = await userRepository.listUsersForManagement();
  return users.map(mapUserAdminToViewModel);
};
