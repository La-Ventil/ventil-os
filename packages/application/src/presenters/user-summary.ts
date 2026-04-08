import { resolveAvatarSelection } from '@repo/avatar-system';
import type { UserSummaryReadModel } from '@repo/db/read-models';
import { formatUserFullName } from '@repo/domain/user/user-name';
import type { UserSummaryViewModel } from '@repo/application/users/models/user-summary';

type UserSummarySource =
  | UserSummaryReadModel
  | {
      id: string;
      firstName: string;
      lastName: string;
      username: string;
      image?: string | null;
      avatar?: unknown;
      email: string;
    };

export const mapUserSummaryToViewModel = (user: UserSummarySource): UserSummaryViewModel => ({
  id: user.id,
  firstName: user.firstName,
  lastName: user.lastName,
  fullName: formatUserFullName(user),
  username: user.username,
  avatar: user.avatar ? resolveAvatarSelection(user.avatar) : null,
  image: user.image ?? null,
  email: user.email
});
