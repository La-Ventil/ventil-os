import type { DayKey } from '../../time/date-time';
import { formatDayKey, getDayInterval, getDayIntervalForDayKey } from '../../time/date-time';
import { machineReservationRepository } from '@repo/db';
import type { MachineReservationAvailabilitySchema } from '@repo/db/schemas';
import type { MachineReservationViewModel } from '@repo/view-models/machine-reservation';
import { mapMachineReservationToViewModel } from '../../presenters/machine-reservation';
import type { Query } from '../../usecase';

export const viewMachineReservationsForDay: Query<[string, Date, string], MachineReservationViewModel[]> = async (
  machineId: string,
  date: Date,
  timeZone: string
) => {
  const { start, end } = getDayIntervalForDayKey(formatDayKey(date, timeZone), timeZone);
  const reservations = await machineReservationRepository.listForMachineBetween(machineId, start, end);
  return reservations.map(mapMachineReservationToViewModel);
};

export const viewMachineReservationsForDayKey: Query<[string, DayKey, string], MachineReservationViewModel[]> = async (
  machineId: string,
  dayKey: DayKey,
  timeZone: string
) => {
  const { start, end } = getDayIntervalForDayKey(dayKey, timeZone);
  const reservations = await machineReservationRepository.listForMachineBetween(machineId, start, end);
  return reservations.map(mapMachineReservationToViewModel);
};

export const viewMachineReservationsForDayAllMachines: Query<
  [Date, string],
  MachineReservationAvailabilitySchema[]
> = async (date: Date, timeZone: string) => {
  const { start, end } = getDayInterval(date, timeZone);
  return machineReservationRepository.listForMachinesBetween(start, end);
};

export const viewMachineReservationsForUser: Query<[string], MachineReservationViewModel[]> = async (userId: string) => {
  const reservations = await machineReservationRepository.listForUser(userId);
  return reservations.map(mapMachineReservationToViewModel);
};
