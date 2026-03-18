import type { MachineViewModel } from '@repo/application/view-models/machine';
import type { MachineReservationAvailabilityReadModel } from '@repo/db/read-models';
import { resolveAvailabilityByMachineId } from '@repo/domain/machine/machine-availability-rules';

export const resolveAvailabilityForMachines = (
  machines: MachineViewModel[],
  reservations: MachineReservationAvailabilityReadModel[],
  date: Date,
  dayEnd: Date
): Map<string, MachineViewModel['availability']> => {
  const baseAvailability = new Map(machines.map((machine) => [machine.id, machine.availability]));
  return resolveAvailabilityByMachineId(baseAvailability, reservations, date, dayEnd);
};
