import type { Prisma } from '@prisma/client';
import type { Email } from '@repo/domain/user/email';

export const userSummarySelect = {
  id: true,
  firstName: true,
  lastName: true,
  username: true,
  image: true,
  email: true
} as const;

export type UserSummaryRow = Prisma.UserGetPayload<{
  select: typeof userSummarySelect;
}>;

export type UserSummaryReadModel = Omit<UserSummaryRow, 'email'> & {
  email: Email;
};
