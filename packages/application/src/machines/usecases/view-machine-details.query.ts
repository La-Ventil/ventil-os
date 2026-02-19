import { machineRepository } from '@repo/db';
import type { MachineDetailsViewModel } from '@repo/view-models/machine-details';
import { resolveMachineAvailabilityFromActivityStatus } from '@repo/domain/machine/machine-availability';
import { mapMachineDetailsToViewModel } from '../../presenters/machine-details';
import type { Query } from '../../usecase';

export const viewMachineDetails: Query<[string], MachineDetailsViewModel | null> = async (id: string) => {
  const machine = await machineRepository.getMachineDetailsById(id);
  if (!machine) {
    return null;
  }

  const availability = resolveMachineAvailabilityFromActivityStatus(machine.status);
  return mapMachineDetailsToViewModel(machine, availability);
};
