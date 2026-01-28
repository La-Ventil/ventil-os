import type { Prisma } from '@prisma/client';

export type MachineSchema = Prisma.MachineGetPayload<Prisma.MachineDefaultArgs>;

export type MachineAdminSchema = Prisma.MachineGetPayload<{
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
