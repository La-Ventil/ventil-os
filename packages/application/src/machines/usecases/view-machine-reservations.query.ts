import type { DayKey } from '../../time/date-time';
import { getDayIntervalForDayKey } from '../../time/date-time';
import { machineReservationRepository } from '@repo/db';
import type { MachineReservationViewModel } from '@repo/view-models/machine-reservation';
import { mapMachineReservationToViewModel } from '../../presenters/machine-reservation';
import type { Query } from '../../usecase';

export const viewMachineReservationsForDayKey: Query<[string, DayKey, string], MachineReservationViewModel[]> = async (
  machineId: string,
  dayKey: DayKey,
  timeZone: string
) => {
  const { start, end } = getDayIntervalForDayKey(dayKey, timeZone);
  const reservations = await machineReservationRepository.listForMachineBetween(machineId, start, end);
  return reservations.map(mapMachineReservationToViewModel);
};

export const viewMachineReservationsForUser: Query<[string], MachineReservationViewModel[]> = async (userId: string) => {
  const reservations = await machineReservationRepository.listForUser(userId);
  return reservations.map(mapMachineReservationToViewModel);
};
