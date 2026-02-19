import type { MachineSummaryReadModel } from '@repo/db/read-models';
import type { MachineViewModel } from '@repo/view-models/machine';
import { resolveMachineAvailabilityFromActivityStatus } from '@repo/domain/machine/machine-availability';

export const mapMachineToViewModel = (machine: MachineSummaryReadModel): MachineViewModel => ({
  id: machine.id,
  category: machine.category,
  name: machine.name,
  description: machine.description ?? '',
  availability: resolveMachineAvailabilityFromActivityStatus(machine.status),
  imageUrl: machine.imageUrl ?? undefined
});
