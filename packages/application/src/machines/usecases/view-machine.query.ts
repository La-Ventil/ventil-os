import { machineRepository } from '@repo/db';
import type { MachineViewModel } from '@repo/view-models/machine';
import { mapMachineToViewModel } from '../../presenters/machine';
import type { Query } from '../../usecase';

export const viewMachine: Query<[string], MachineViewModel | null> = async (id: string) => {
  const machine = await machineRepository.getMachineById(id);
  return machine ? mapMachineToViewModel(machine) : null;
};
