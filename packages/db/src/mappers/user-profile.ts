import type { Prisma } from '@prisma/client';
import type { UserProfile } from '@repo/domain/user-profile';

export type UserSchema = Prisma.UserGetPayload<{
  select: {
    id: true;
    email: true;
    profile: true;
    username: true;
    educationLevel: true;
    pedagogicalAdmin: true;
    globalAdmin: true;
    lastName: true;
    firstName: true;
  };
}>;

export const mapUserProfileToViewModel = (
  user: UserSchema
): UserProfile => ({
  id: user.id,
  email: user.email,
  lastName: user.lastName,
  firstName: user.firstName,
  profile: user.profile,
  username: user.username,
  educationLevel: user.educationLevel,
  globalAdmin: user.globalAdmin,
  pedagogicalAdmin: user.pedagogicalAdmin
});
