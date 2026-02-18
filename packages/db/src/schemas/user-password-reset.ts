import type { Prisma } from '@prisma/client';
import type { Email } from '@repo/domain/user/email';

export const userPasswordResetSelect = {
  id: true,
  email: true,
  firstName: true,
  lastName: true
} as const;

export type UserPasswordResetRow = Prisma.UserGetPayload<{
  select: typeof userPasswordResetSelect;
}>;

export type UserPasswordResetReadModel = Omit<UserPasswordResetRow, 'email'> & {
  email: Email;
};
