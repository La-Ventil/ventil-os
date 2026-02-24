import type { Prisma } from '@prisma/client';

export const userAdminSelect = {
  id: true,
  email: true,
  image: true,
  firstName: true,
  lastName: true,
  username: true,
  profile: true,
  studentProfile: true,
  externalProfile: true,
  pedagogicalAdmin: true,
  globalAdmin: true,
  blocked: true,
  _count: {
    select: {
      eventRegistrations: true,
      openBadgeProgresses: true
    }
  }
} as const;

export type UserAdminPayload = Prisma.UserGetPayload<{
  select: typeof userAdminSelect;
}>;
