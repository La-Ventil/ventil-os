import type { MachineSchema } from '@repo/db/schemas';
import { MachineAvailability, type MachineViewModel } from '@repo/view-models/machine';

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

const mapMachineStatus = (status: MachineSchema['status']): MachineAvailability => {
  if (status === 'inactive') {
    return MachineAvailability.Occupied;
  }

  return MachineAvailability.Available;
};
