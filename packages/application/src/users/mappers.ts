import type { UserProfileSchema } from '@repo/db/schemas';
import { User } from '@repo/domain/user/user';

export const toDomainUser = (user: UserProfileSchema): User =>
  User.from({
    id: user.id,
    profile: user.profile,
    email: user.email,
    pendingEmail: user.pendingEmail,
    emailVerifiedAt: user.emailVerified ?? null,
    image: user.image,
    username: user.username,
    educationLevel: user.educationLevel,
    lastName: user.lastName,
    firstName: user.firstName,
    globalAdmin: user.globalAdmin,
    pedagogicalAdmin: user.pedagogicalAdmin
  });
