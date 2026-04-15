import type { MachineSummaryReadModel } from '@repo/db/read-models';
import type { MachineViewModel } from '@repo/application/machines/models/machine';
import { resolveMachineBaseAvailability } from '@repo/domain/machine/machine-availability';

export const mapMachineToViewModel = (machine: MachineSummaryReadModel): MachineViewModel => ({
  id: machine.id,
  category: machine.category,
  name: machine.name,
  description: machine.description ?? '',
  availability: resolveMachineBaseAvailability(machine.status),
  imageUrl: machine.imageUrl ?? undefined
});
