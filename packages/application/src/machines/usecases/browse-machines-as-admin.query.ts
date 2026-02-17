import { machineRepository } from '@repo/db';
import type { MachineAdminViewModel } from '@repo/view-models/machine-admin';
import { mapMachineAdminToViewModel } from '../../presenters/machine-admin';
import type { Query } from '../../usecase';

export const browseMachinesAsAdmin: Query<[], MachineAdminViewModel[]> = async () => {
  const machines = await machineRepository.listMachinesForAdmin();
  return machines.map(mapMachineAdminToViewModel);
};
