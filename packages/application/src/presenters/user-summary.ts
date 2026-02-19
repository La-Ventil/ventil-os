import type { UserSummaryReadModel } from '@repo/db/read-models';
import type { UserSummaryViewModel } from '@repo/view-models/user-summary';

type UserSummarySource =
  | UserSummaryReadModel
  | {
      id: string;
      firstName: string;
      lastName: string;
      username: string;
      image?: string | null;
      email: string;
    };

export const mapUserSummaryToViewModel = (user: UserSummarySource): UserSummaryViewModel => ({
  id: user.id,
  firstName: user.firstName,
  lastName: user.lastName,
  username: user.username,
  image: user.image ?? null,
  email: user.email
});
