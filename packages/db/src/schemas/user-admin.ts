import type { Prisma } from '@prisma/client';

export type UserAdminSchema = Prisma.UserGetPayload<{
  select: {
    id: true;
    email: true;
    firstName: true;
    lastName: true;
    username: true;
    profile: true;
    studentProfile: true;
    externalProfile: true;
    pedagogicalAdmin: true;
    globalAdmin: true;
    _count: {
      select: {
        eventRegistrations: true;
        openBadgeProgresses: true;
      };
    };
  };
}>;
