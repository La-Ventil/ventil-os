import type { Prisma } from '@prisma/client';

export type UserSummarySchema = Prisma.UserGetPayload<{
  select: {
    id: true;
    firstName: true;
    lastName: true;
    username: true;
    image: true;
    email: true;
  };
}>;
