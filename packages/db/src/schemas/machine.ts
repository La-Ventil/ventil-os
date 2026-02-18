import type { Prisma } from '@prisma/client';
import type { ActivityStatus } from '@repo/domain/activity-status';

export const selectMachineSummarySchemaRaw = {
  id: true,
  name: true,
  category: true,
  description: true,
  imageUrl: true,
  status: true
} as const;

export type MachineSummarySchemaRaw = Prisma.MachineGetPayload<{
  select: typeof selectMachineSummarySchemaRaw;
}>;

export type MachineSummarySchema = Omit<MachineSummarySchemaRaw, 'status'> & {
  status: ActivityStatus;
};

export const selectMachineAdminSchemaRaw = {
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

export type MachineAdminSchemaRaw = Prisma.MachineGetPayload<{
  select: typeof selectMachineAdminSchemaRaw;
}>;

export type MachineAdminSchema = Omit<MachineAdminSchemaRaw, 'status'> & {
  status: ActivityStatus;
};
