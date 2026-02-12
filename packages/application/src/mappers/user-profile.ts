import type { UserProfileSchema } from '@repo/db/schemas';
import { parseEducationLevel } from '@repo/domain/education-level';
import { Email } from '@repo/domain/email';
import type { UserProfile } from '@repo/view-models/user-profile';
import { resolveProfileType } from './profile-type';

export const mapUserProfileToViewModel = (
  user: UserProfileSchema
): UserProfile => ({
  id: user.id,
  profile: resolveProfileType(user),
  email: Email.from(user.email),
  image: user.image ?? null,
  username: user.username,
  educationLevel: parseEducationLevel(user.educationLevel),
  globalAdmin: user.globalAdmin,
  pedagogicalAdmin: user.pedagogicalAdmin,
  lastName: user.lastName ?? undefined,
  firstName: user.firstName
});
