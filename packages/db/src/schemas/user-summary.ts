import type { Prisma } from '@prisma/client';
import type { Email } from '@repo/domain/user/email';

export type UserSummarySchemaRaw = Prisma.UserGetPayload<{
  select: {
    id: true;
    firstName: true;
    lastName: true;
    username: true;
    image: true;
    email: true;
  };
}>;

export type UserSummarySchema = Omit<UserSummarySchemaRaw, 'email'> & {
  email: Email;
};
