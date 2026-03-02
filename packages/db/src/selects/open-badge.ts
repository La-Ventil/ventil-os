import type { Prisma } from '@prisma/client';

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

export type OpenBadgePayload = Prisma.OpenBadgeGetPayload<{
  include: typeof openBadgeInclude;
}>;

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

export type OpenBadgeProgressPayload = Prisma.OpenBadgeProgressGetPayload<{
  include: typeof openBadgeProgressInclude;
}>;

export const openBadgeAdminSelect = {
  id: true,
  name: true,
  coverImage: true,
  status: true,
  _count: {
    select: {
      levels: true,
      openBadgeProgresses: true,
      machines: true
    }
  }
} as const;

export type OpenBadgeAdminPayload = Prisma.OpenBadgeGetPayload<{
  select: typeof openBadgeAdminSelect;
}>;
