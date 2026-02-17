import type { UserSummarySchema } from '@repo/db/schemas';
import type { UserSummaryViewModel } from '@repo/view-models/user-summary';

type UserSummarySource =
  | UserSummarySchema
  | {
      id: string;
      firstName: string;
      lastName: string | null;
      username: string;
      image: string | null;
      email: string;
    };

export const mapUserSummaryToViewModel = (user: UserSummarySource): UserSummaryViewModel => ({
  id: user.id,
  firstName: user.firstName,
  lastName: user.lastName ?? null,
  username: user.username,
  image: user.image ?? null,
  email: user.email
});
