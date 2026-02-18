import type { Prisma } from '@prisma/client';
import type { ActivityStatus } from '@repo/domain/activity-status';
import type { OpenBadgeLevel } from '@repo/domain/badge/open-badge-level';

export const selectOpenBadgeLevelSchemaRaw = {
  level: true,
  title: true,
  description: true
} as const;

export const includeOpenBadgeSchemaRaw = {
  levels: {
    select: selectOpenBadgeLevelSchemaRaw,
    orderBy: { level: 'asc' }
  }
} as const;

export type OpenBadgeSchemaRaw = Prisma.OpenBadgeGetPayload<{
  include: typeof includeOpenBadgeSchemaRaw;
}>;

export type OpenBadgeSchema = Omit<OpenBadgeSchemaRaw, 'levels'> & {
  levels: OpenBadgeLevel[];
};

export type OpenBadgeLevelSchema = OpenBadgeSchema['levels'][number];

export const includeOpenBadgeProgressSchemaRaw = {
  highestLevel: {
    select: {
      level: true
    }
  },
  openBadge: {
    include: includeOpenBadgeSchemaRaw
  }
} as const;

export type OpenBadgeProgressSchemaRaw = Prisma.OpenBadgeProgressGetPayload<{
  include: typeof includeOpenBadgeProgressSchemaRaw;
}>;

export type OpenBadgeProgressSchema = Omit<OpenBadgeProgressSchemaRaw, 'openBadge'> & {
  openBadge: OpenBadgeSchema;
};

export const selectOpenBadgeAdminSchemaRaw = {
  id: true,
  name: true,
  status: true,
  _count: {
    select: {
      levels: true,
      openBadgeProgresses: true
    }
  }
} as const;

export type OpenBadgeAdminSchemaRaw = Prisma.OpenBadgeGetPayload<{
  select: typeof selectOpenBadgeAdminSchemaRaw;
}>;

export type OpenBadgeAdminSchema = Omit<OpenBadgeAdminSchemaRaw, 'status'> & {
  status: ActivityStatus;
};
