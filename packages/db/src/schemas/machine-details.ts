import type { Prisma } from '@prisma/client';
import type { ActivityStatus } from '@repo/domain/activity-status';
import type { OpenBadgeRequirement } from '@repo/domain/badge/open-badge-requirement';

export const selectMachineDetailsSchemaRaw = {
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

export type MachineDetailsSchemaRaw = Prisma.MachineGetPayload<{
  select: typeof selectMachineDetailsSchemaRaw;
}>;

export type MachineDetailsSchema = Omit<MachineDetailsSchemaRaw, 'status' | 'badgeRequirements'> & {
  status: ActivityStatus;
  badgeRequirements: OpenBadgeRequirement[];
};
