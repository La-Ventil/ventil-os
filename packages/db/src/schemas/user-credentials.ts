import type { Prisma } from '@prisma/client';

export type UserCredentialsSchema = Prisma.UserGetPayload<{
  select: {
    id: true;
    email: true;
    password: true;
    salt: true;
    iterations: true;
    profile: true;
    username: true;
    educationLevel: true;
    pedagogicalAdmin: true;
    globalAdmin: true;
    lastName: true;
    firstName: true;
  };
}>;
