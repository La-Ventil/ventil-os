import type { Prisma } from '@prisma/client';

export const userCredentialsSelect = {
  id: true,
  email: true,
  emailVerified: true,
  image: true,
  password: true,
  salt: true,
  iterations: true,
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

export type UserCredentialsPayload = Prisma.UserGetPayload<{
  select: typeof userCredentialsSelect;
}>;
