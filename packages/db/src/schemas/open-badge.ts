import type { Prisma } from '@prisma/client';

export type OpenBadgeSchema = Prisma.OpenBadgeGetPayload<{
  include: {
    levels: {
      select: {
        level: true;
        title: true;
        description: true;
      };
    };
  };
}>;

export type OpenBadgeLevelSchema = OpenBadgeSchema['levels'][number];

export type OpenBadgeProgressSchema = Prisma.OpenBadgeProgressGetPayload<{
  include: {
    highestLevel: {
      select: {
        level: true;
      };
    };
    openBadge: {
      include: {
        levels: {
          select: {
            level: true;
            title: true;
            description: true;
          };
        };
      };
    };
  };
}>;

export type OpenBadgeAdminSchema = Prisma.OpenBadgeGetPayload<{
  select: {
    id: true;
    name: true;
    status: true;
    _count: {
      select: {
        levels: true;
        openBadgeProgresses: true;
      };
    };
  };
}>;
