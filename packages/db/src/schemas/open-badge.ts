import type { Prisma } from '@prisma/client';
import type { ActivityStatus } from '@repo/domain/activity-status';
import type { OpenBadgeLevel } from '@repo/domain/badge/open-badge-level';

export type OpenBadgeSchemaRaw = Prisma.OpenBadgeGetPayload<{
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

export type OpenBadgeSchema = Omit<OpenBadgeSchemaRaw, 'levels'> & {
  levels: OpenBadgeLevel[];
};

export type OpenBadgeLevelSchema = OpenBadgeSchema['levels'][number];

export type OpenBadgeProgressSchemaRaw = Prisma.OpenBadgeProgressGetPayload<{
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

export type OpenBadgeProgressSchema = Omit<OpenBadgeProgressSchemaRaw, 'openBadge'> & {
  openBadge: OpenBadgeSchema;
};

export type OpenBadgeAdminSchemaRaw = Prisma.OpenBadgeGetPayload<{
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

export type OpenBadgeAdminSchema = Omit<OpenBadgeAdminSchemaRaw, 'status'> & {
  status: ActivityStatus;
};
