import { machineRepository } from '@repo/db';
import type { MachineAdminViewModel } from '@repo/view-models/machine-admin';
import type { MachineViewModel } from '@repo/view-models/machine';
import { mapMachineToViewModel } from './mappers/machine';
import { mapMachineAdminToViewModel } from './mappers/machine-admin';

export const listMachines = async (): Promise<MachineViewModel[]> => {
  const machines = await machineRepository.listMachines();
  return machines.map(mapMachineToViewModel);
};

export const listAdminMachines = async (): Promise<MachineAdminViewModel[]> => {
  const machines = await machineRepository.listMachinesForAdmin();
  return machines.map(mapMachineAdminToViewModel);
};

export const getMachineById = async (id: string): Promise<MachineViewModel | null> => {
  const machine = await machineRepository.getMachineById(id);
  return machine ? mapMachineToViewModel(machine) : null;
};
