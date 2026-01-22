import type { ActivityStatus, Prisma } from '@prisma/client';
import { MachineAvailability } from '@repo/domain/view-models/machine';
import type { MachineViewModel } from '@repo/domain/view-models/machine';

export type MachineSchema = Prisma.MachineGetPayload<{}>;

export const mapMachineToViewModel = (
  machine: MachineSchema
): MachineViewModel => ({
  id: machine.id,
  category: machine.category,
  name: machine.name,
  description: machine.description ?? '',
  availability: mapMachineStatus(machine.status),
  imageUrl: machine.imageUrl ?? undefined
});

const mapMachineStatus = (status: ActivityStatus): MachineAvailability => {
  if (status === 'inactive') {
    return MachineAvailability.Occupied;
  }

  return MachineAvailability.Available;
};
