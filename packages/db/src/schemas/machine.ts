import type { Prisma } from '@prisma/client';
import type { ActivityStatus } from '@repo/domain/activity-status';

export const machineSummarySelect = {
  id: true,
  name: true,
  category: true,
  description: true,
  imageUrl: true,
  status: true
} as const;

export type MachineSummaryRow = Prisma.MachineGetPayload<{
  select: typeof machineSummarySelect;
}>;

export type MachineSummaryReadModel = Omit<MachineSummaryRow, 'status'> & {
  status: ActivityStatus;
};

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

export type MachineAdminRow = Prisma.MachineGetPayload<{
  select: typeof machineAdminSelect;
}>;

export type MachineAdminReadModel = Omit<MachineAdminRow, 'status'> & {
  status: ActivityStatus;
};
