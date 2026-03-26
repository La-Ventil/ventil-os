import { resolveAvatarSelection } from '@repo/avatar-system';
import type { UserProfileReadModel } from '@repo/db/read-models';
import { formatUserFullName } from '@repo/domain/user/user-name';
import type { UserProfile } from '@repo/application/users/models/user-profile';

export const mapUserProfileToViewModel = (user: UserProfileReadModel): UserProfile => ({
  id: user.id,
  profile: user.profile,
  email: user.email,
  pendingEmail: user.pendingEmail ?? null,
  image: user.image ?? null,
  avatar: resolveAvatarSelection(user.avatar),
  username: user.username,
  educationLevel: user.educationLevel ?? null,
  globalAdmin: user.globalAdmin,
  pedagogicalAdmin: user.pedagogicalAdmin,
  lastName: user.lastName,
  firstName: user.firstName,
  fullName: formatUserFullName(user)
});
