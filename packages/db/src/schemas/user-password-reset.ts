import type { Prisma } from '@prisma/client';

export type UserPasswordResetSchema = Prisma.UserGetPayload<{
  select: {
    id: true;
    email: true;
    firstName: true;
    lastName: true;
  };
}>;
