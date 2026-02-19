import type { MachineSummaryReadModel } from '@repo/db/read-models';
import { MachineAvailability, type MachineViewModel } from '@repo/view-models/machine';
import { resolveMachineAvailabilityFromActivityStatus } from '@repo/domain/machine/machine-availability';

export const mapMachineToViewModel = (machine: MachineSummaryReadModel): MachineViewModel => ({
  id: machine.id,
  category: machine.category,
  name: machine.name,
  description: machine.description ?? '',
  availability: mapMachineStatus(machine.status),
  imageUrl: machine.imageUrl ?? undefined
});

export const mapMachineStatus = (status: MachineSummaryReadModel['status']): MachineAvailability => {
  return resolveMachineAvailabilityFromActivityStatus(status);
};
