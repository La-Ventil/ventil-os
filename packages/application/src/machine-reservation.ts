import { addDays, startOfDay } from 'date-fns';
import { machineReservationRepository } from '@repo/db';
import type { MachineReservationViewModel } from '@repo/view-models/machine-reservation';
import { mapMachineReservationToViewModel } from './mappers/machine-reservation';
import type { DateInterval } from './date-interval';

const getDayRange = (date: Date): DateInterval => {
  const start = startOfDay(date);
  const end = addDays(start, 1);
  return { start, end };
};

export const listMachineReservationsForDay = async (
  machineId: string,
  date: Date
): Promise<MachineReservationViewModel[]> => {
  const { start, end } = getDayRange(date);
  const reservations = await machineReservationRepository.listForMachineBetween(machineId, start, end);
  return reservations.map(mapMachineReservationToViewModel);
};
