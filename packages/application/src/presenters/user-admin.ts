import { resolveAvatarSelection } from '@repo/avatar-system';
import type { UserAdminReadModel } from '@repo/db/read-models';
import { formatUserFullName } from '@repo/domain/user/user-name';
import type { UserAdminViewModel } from '@repo/application/users/models/user-admin';

export const mapUserAdminToViewModel = (user: UserAdminReadModel): UserAdminViewModel => ({
  id: user.id,
  email: user.email,
  image: user.image,
  avatar: user.avatar ? resolveAvatarSelection(user.avatar) : null,
  firstName: user.firstName,
  lastName: user.lastName,
  fullName: formatUserFullName(user),
  username: user.username,
  profile: user.profile,
  globalAdmin: user.globalAdmin,
  pedagogicalAdmin: user.pedagogicalAdmin,
  blocked: user.blocked,
  stats: user.stats
});
