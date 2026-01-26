import type { UserProfileSchema } from '@repo/db/schemas';
import type { UserProfile } from '@repo/view-models/user-profile';

export const mapUserProfileToViewModel = (
  user: UserProfileSchema
): UserProfile => ({
  id: user.id,
  profile: user.profile,
  email: user.email,
  username: user.username,
  educationLevel: user.educationLevel,
  globalAdmin: user.globalAdmin,
  pedagogicalAdmin: user.pedagogicalAdmin,
  lastName: user.lastName ?? undefined,
  firstName: user.firstName
});
