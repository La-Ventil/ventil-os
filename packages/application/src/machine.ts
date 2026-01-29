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

const DEFAULT_MACHINE_CATEGORY = 'Machine';

export type CreateMachineInput = {
  name: string;
  description: string;
  imageUrl: string;
  activationEnabled: boolean;
  creatorId: string;
};

export const createMachine = async (input: CreateMachineInput) =>
  machineRepository.createMachine({
    name: input.name,
    description: input.description,
    imageUrl: input.imageUrl,
    status: input.activationEnabled ? 'active' : 'inactive',
    creatorId: input.creatorId,
    category: DEFAULT_MACHINE_CATEGORY
  });
