import type { Prisma } from '@prisma/client';

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

export type MachineDetailsPayload = Prisma.MachineGetPayload<{
  select: typeof machineDetailsSelect;
}>;
