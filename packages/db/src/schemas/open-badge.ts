import type { Prisma } from '@prisma/client';
import type { ActivityStatus } from '@repo/domain/activity-status';
import type { OpenBadgeLevel } from '@repo/domain/badge/open-badge-level';

export const openBadgeLevelSelect = {
  level: true,
  title: true,
  description: true
} as const;

export const openBadgeInclude = {
  levels: {
    select: openBadgeLevelSelect,
    orderBy: { level: 'asc' }
  }
} as const;

export type OpenBadgeRow = Prisma.OpenBadgeGetPayload<{
  include: typeof openBadgeInclude;
}>;

export type OpenBadgeReadModel = Omit<OpenBadgeRow, 'levels'> & {
  levels: OpenBadgeLevel[];
};

export type OpenBadgeLevelReadModel = OpenBadgeReadModel['levels'][number];

export const openBadgeProgressInclude = {
  highestLevel: {
    select: {
      level: true
    }
  },
  openBadge: {
    include: openBadgeInclude
  }
} as const;

export type OpenBadgeProgressRow = Prisma.OpenBadgeProgressGetPayload<{
  include: typeof openBadgeProgressInclude;
}>;

export type OpenBadgeProgressReadModel = Omit<OpenBadgeProgressRow, 'openBadge'> & {
  openBadge: OpenBadgeReadModel;
};

export const openBadgeAdminSelect = {
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

export type OpenBadgeAdminRow = Prisma.OpenBadgeGetPayload<{
  select: typeof openBadgeAdminSelect;
}>;

export type OpenBadgeAdminReadModel = Omit<OpenBadgeAdminRow, 'status'> & {
  status: ActivityStatus;
};
