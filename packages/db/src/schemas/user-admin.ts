import type { Prisma } from '@prisma/client';
import type { Email } from '@repo/domain/user/email';
import type { UserRole } from '@repo/domain/user/user-role';

export const userAdminSelect = {
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  username: true,
  profile: true,
  studentProfile: true,
  externalProfile: true,
  pedagogicalAdmin: true,
  globalAdmin: true,
  _count: {
    select: {
      eventRegistrations: true,
      openBadgeProgresses: true
    }
  }
} as const;

export type UserAdminRow = Prisma.UserGetPayload<{
  select: typeof userAdminSelect;
}>;

export type UserAdminReadModel = Omit<
  UserAdminRow,
  'email' | 'profile' | 'studentProfile' | 'externalProfile'
> & {
  email: Email;
  profile: UserRole;
};
