import type { Prisma } from '@prisma/client';
import type { ActivityStatus } from '@repo/domain/activity-status';

export type MachineSchemaRaw = Prisma.MachineGetPayload<Prisma.MachineDefaultArgs>;

export type MachineSchema = Omit<MachineSchemaRaw, 'status'> & {
  status: ActivityStatus;
};

export type MachineAdminSchemaRaw = Prisma.MachineGetPayload<{
  select: {
    id: true;
    name: true;
    category: true;
    status: true;
    room: {
      select: {
        name: true;
      };
    };
    _count: {
      select: {
        badgeRequirements: true;
      };
    };
  };
}>;

export type MachineAdminSchema = Omit<MachineAdminSchemaRaw, 'status'> & {
  status: ActivityStatus;
};
