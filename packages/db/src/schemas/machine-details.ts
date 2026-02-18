import type { Prisma } from '@prisma/client';
import type { ActivityStatus } from '@repo/domain/activity-status';
import type { OpenBadgeRequirement } from '@repo/domain/badge/open-badge-requirement';

export const machineDetailsSelect = {
  id: true,
  category: true,
  name: true,
  description: true,
  imageUrl: true,
  status: true,
  room: {
    select: {
      name: true
    }
  },
  badgeRequirements: {
    select: {
      id: true,
      rule: true,
      requiredOpenBadge: {
        select: {
          id: true,
          name: true,
          type: true,
          coverImage: true
        }
      },
      requiredOpenBadgeLevel: {
        select: {
          id: true,
          title: true,
          level: true
        }
      }
    }
  }
} as const;

export type MachineDetailsRow = Prisma.MachineGetPayload<{
  select: typeof machineDetailsSelect;
}>;

export type MachineDetailsReadModel = Omit<MachineDetailsRow, 'status' | 'badgeRequirements'> & {
  status: ActivityStatus;
  badgeRequirements: OpenBadgeRequirement[];
};
