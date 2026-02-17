import { machineRepository } from '@repo/db';
import type { MachineDetailsViewModel } from '@repo/view-models/machine-details';
import { mapMachineDetailsToViewModel } from '../../presenters/machine-details';
import { mapMachineStatus } from '../../presenters/machine';
import type { Query } from '../../usecase';

export const viewMachineDetails: Query<[string], MachineDetailsViewModel | null> = async (id: string) => {
  const machine = await machineRepository.getMachineDetailsById(id);
  if (!machine) {
    return null;
  }

  const availability = mapMachineStatus(machine.status);
  return mapMachineDetailsToViewModel(machine, availability);
};
