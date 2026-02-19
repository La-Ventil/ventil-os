import type { Prisma } from '@prisma/client';

export const machineSummarySelect = {
  id: true,
  name: true,
  category: true,
  description: true,
  imageUrl: true,
  status: true
} as const;

export type MachineSummaryPayload = Prisma.MachineGetPayload<{
  select: typeof machineSummarySelect;
}>;

export const machineAdminSelect = {
  id: true,
  name: true,
  category: true,
  status: true,
  room: {
    select: {
      name: true
    }
  },
  _count: {
    select: {
      badgeRequirements: true
    }
  }
} as const;

export type MachineAdminPayload = Prisma.MachineGetPayload<{
  select: typeof machineAdminSelect;
}>;
