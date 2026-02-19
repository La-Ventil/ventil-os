import type { Prisma } from '@prisma/client';

export const userSummarySelect = {
  id: true,
  firstName: true,
  lastName: true,
  username: true,
  image: true,
  email: true
} as const;

export type UserSummaryPayload = Prisma.UserGetPayload<{
  select: typeof userSummarySelect;
}>;
