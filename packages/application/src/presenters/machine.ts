import type { MachineSummarySchema } from '@repo/db/schemas';
import { MachineAvailability, type MachineViewModel } from '@repo/view-models/machine';
import { resolveMachineAvailabilityFromActivityStatus } from '@repo/domain/machine/machine-availability';

export const mapMachineToViewModel = (machine: MachineSummarySchema): MachineViewModel => ({
  id: machine.id,
  category: machine.category,
  name: machine.name,
  description: machine.description ?? '',
  availability: mapMachineStatus(machine.status),
  imageUrl: machine.imageUrl ?? undefined
});

export const mapMachineStatus = (status: MachineSummarySchema['status']): MachineAvailability => {
  return resolveMachineAvailabilityFromActivityStatus(status);
};
