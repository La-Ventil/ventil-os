import type { Prisma } from '@prisma/client';
import type { Email } from '@repo/domain/user/email';

export const selectUserPasswordResetSchemaRaw = {
  id: true,
  email: true,
  firstName: true,
  lastName: true
} as const;

export type UserPasswordResetSchemaRaw = Prisma.UserGetPayload<{
  select: typeof selectUserPasswordResetSchemaRaw;
}>;

export type UserPasswordResetSchema = Omit<UserPasswordResetSchemaRaw, 'email'> & {
  email: Email;
};
