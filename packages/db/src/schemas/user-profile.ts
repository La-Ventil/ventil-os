import type { Prisma } from '@prisma/client';

export type UserProfileSchema = Prisma.UserGetPayload<{
  select: {
    id: true;
    email: true;
    pendingEmail: true;
    image: true;
    profile: true;
    studentProfile: true;
    externalProfile: true;
    username: true;
    educationLevel: true;
    pedagogicalAdmin: true;
    globalAdmin: true;
    lastName: true;
    firstName: true;
  };
}>;
