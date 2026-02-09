import type { UserSummarySchema } from '@repo/db/schemas';
import type { UserSummaryViewModel } from '@repo/view-models/user-summary';

export const mapUserSummaryToViewModel = (user: UserSummarySchema): UserSummaryViewModel => ({
  id: user.id,
  firstName: user.firstName,
  lastName: user.lastName ?? null,
  username: user.username,
  image: user.image ?? null,
  email: user.email
});
