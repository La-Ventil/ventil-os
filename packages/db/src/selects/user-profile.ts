import type { Prisma } from '@prisma/client';

export const userProfileSelect = {
  id: true,
  email: true,
  pendingEmail: true,
  emailVerified: true,
  image: true,
  avatar: true,
  profile: true,
  studentProfile: true,
  externalProfile: true,
  username: true,
  educationLevel: true,
  pedagogicalAdmin: true,
  globalAdmin: true,
  blocked: true,
  lastName: true,
  firstName: true
} as const;

export type UserProfilePayload = Prisma.UserGetPayload<{
  select: typeof userProfileSelect;
}>;
