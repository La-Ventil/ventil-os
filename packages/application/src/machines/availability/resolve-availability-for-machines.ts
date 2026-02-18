import type { MachineViewModel } from '@repo/view-models/machine';
import type { MachineReservationAvailabilitySchema } from '@repo/db/schemas';
import { resolveAvailabilityByMachineId } from '@repo/domain/machine/machine-availability-rules';

export const resolveAvailabilityForMachines = (
  machines: MachineViewModel[],
  reservations: MachineReservationAvailabilitySchema[],
  date: Date,
  dayEnd: Date
): Map<string, MachineViewModel['availability']> => {
  const baseAvailability = new Map(machines.map((machine) => [machine.id, machine.availability]));
  return resolveAvailabilityByMachineId(baseAvailability, reservations, date, dayEnd);
};
