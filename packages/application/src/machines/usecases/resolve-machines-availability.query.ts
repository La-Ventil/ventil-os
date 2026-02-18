import { machineReservationRepository } from '@repo/db';
import type { MachineViewModel } from '@repo/view-models/machine';
import type { Query } from '../../usecase';
import { getDayInterval } from '../../time/date-time';
import { resolveAvailabilityForMachines } from '../availability/resolve-availability-for-machines';

type ResolveMachinesAvailabilityInput = {
  machines: MachineViewModel[];
  timeZone: string;
  date?: Date;
};

export const resolveMachinesAvailability: Query<
  [ResolveMachinesAvailabilityInput],
  Map<string, MachineViewModel['availability']>
> = async ({ machines, timeZone, date = new Date() }: ResolveMachinesAvailabilityInput) => {
  const { start, end } = getDayInterval(date, timeZone);
  const reservations = await machineReservationRepository.listForMachinesBetween(start, end);
  return resolveAvailabilityForMachines(machines, reservations, date, end);
};
