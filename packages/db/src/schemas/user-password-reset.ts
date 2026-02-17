import type { Prisma } from '@prisma/client';
import type { Email } from '@repo/domain/user/email';

export type UserPasswordResetSchemaRaw = Prisma.UserGetPayload<{
  select: {
    id: true;
    email: true;
    firstName: true;
    lastName: true;
  };
}>;

export type UserPasswordResetSchema = Omit<UserPasswordResetSchemaRaw, 'email'> & {
  email: Email;
};
