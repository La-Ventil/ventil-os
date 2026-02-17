import { machineRepository, machineReservationRepository } from '@repo/db';
import type { MachineViewModel } from '@repo/view-models/machine';
import { resolveAvailabilityByMachineId } from '@repo/domain/machine/machine-availability-rules';
import { mapMachineToViewModel } from '../../presenters/machine';
import { getDayInterval } from '../../time/date-time';
import type { Query } from '../../usecase';

export const browseMachines: Query<[string, Date?], MachineViewModel[]> = async (
  timeZone: string,
  date: Date = new Date()
) => {
  const machines = await machineRepository.listMachines();
  const baseMachines = machines.map(mapMachineToViewModel);
  const baseAvailability = new Map(baseMachines.map((machine) => [machine.id, machine.availability]));
  const { start, end } = getDayInterval(date, timeZone);
  const reservations = await machineReservationRepository.listForMachinesBetween(start, end);
  const availabilityById = resolveAvailabilityByMachineId(baseAvailability, reservations, date, end);

  return baseMachines.map((machine) => ({
    ...machine,
    availability: availabilityById.get(machine.id) ?? machine.availability
  }));
};
