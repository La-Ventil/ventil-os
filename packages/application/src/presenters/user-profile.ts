import type { UserProfileReadModel } from '@repo/db/schemas';
import type { UserProfile } from '@repo/view-models/user-profile';

export const mapUserProfileToViewModel = (user: UserProfileReadModel): UserProfile => ({
  id: user.id,
  profile: user.profile,
  email: user.email,
  pendingEmail: user.pendingEmail ?? null,
  image: user.image ?? null,
  username: user.username,
  educationLevel: user.educationLevel ?? null,
  globalAdmin: user.globalAdmin,
  pedagogicalAdmin: user.pedagogicalAdmin,
  lastName: user.lastName ?? undefined,
  firstName: user.firstName
});
