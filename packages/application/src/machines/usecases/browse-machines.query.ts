import { machineRepository } from '@repo/db';
import { isActive } from '@repo/domain/activity-status';
import type { MachineViewModel } from '@repo/application/view-models/machine';
import { mapMachineToViewModel } from '../../presenters/machine';
import type { Query } from '../../usecase';
import { resolveMachinesAvailability } from './resolve-machines-availability.query';

export const browseMachines: Query<[string, Date?], MachineViewModel[]> = async (
  timeZone: string,
  date: Date = new Date()
) => {
  const machines = (await machineRepository.listMachines()).filter((machine) => isActive(machine.status));
  const baseMachines = machines.map(mapMachineToViewModel);
  const availabilityById = await resolveMachinesAvailability({
    machines: baseMachines,
    timeZone,
    date
  });

  return baseMachines.map((machine) => ({
    ...machine,
    availability: availabilityById.get(machine.id) ?? machine.availability
  }));
};
