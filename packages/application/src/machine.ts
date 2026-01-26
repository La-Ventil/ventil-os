import { machineRepository } from '@repo/db';
import type { MachineViewModel } from '@repo/view-models/machine';
import { mapMachineToViewModel } from './mappers/machine';

export const listMachines = async (): Promise<MachineViewModel[]> => {
  const machines = await machineRepository.listMachines();
  return machines.map(mapMachineToViewModel);
};

export const getMachineById = async (id: string): Promise<MachineViewModel | null> => {
  const machine = await machineRepository.getMachineById(id);
  return machine ? mapMachineToViewModel(machine) : null;
};
