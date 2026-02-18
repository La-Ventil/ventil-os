import type { Prisma } from '@prisma/client';
import type { Email } from '@repo/domain/user/email';

export const selectUserSummarySchemaRaw = {
  id: true,
  firstName: true,
  lastName: true,
  username: true,
  image: true,
  email: true
} as const;

export type UserSummarySchemaRaw = Prisma.UserGetPayload<{
  select: typeof selectUserSummarySchemaRaw;
}>;

export type UserSummarySchema = Omit<UserSummarySchemaRaw, 'email'> & {
  email: Email;
};
