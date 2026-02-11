import type { DayKey } from './date-time';
import { addMinutesToDate, formatDayKey, getDayIntervalForDayKey } from './date-time';
import { machineReservationRepository } from '@repo/db';
import type { MachineReservationViewModel } from '@repo/view-models/machine-reservation';
import { mapMachineReservationToViewModel } from './mappers/machine-reservation';
import type { DateInterval } from './date-interval';
import { assertReservationInterval, isReservationSlotInPast } from './machine-reservation-schedule';

export const listMachineReservationsForDay = async (
  machineId: string,
  date: Date,
  timeZone: string
): Promise<MachineReservationViewModel[]> => {
  const { start, end } = getDayIntervalForDayKey(formatDayKey(date, timeZone), timeZone);
  const reservations = await machineReservationRepository.listForMachineBetween(machineId, start, end);
  return reservations.map(mapMachineReservationToViewModel);
};

export const listMachineReservationsForDayKey = async (
  machineId: string,
  dayKey: DayKey,
  timeZone: string
): Promise<MachineReservationViewModel[]> => {
  const { start, end } = getDayIntervalForDayKey(dayKey, timeZone);
  const reservations = await machineReservationRepository.listForMachineBetween(machineId, start, end);
  return reservations.map(mapMachineReservationToViewModel);
};

type MachineReservationCreateInput = {
  machineId: string;
  creatorId: string;
  startsAt: Date;
  durationMinutes: number;
  participantIds?: string[];
};

export const createMachineReservation = async (
  input: MachineReservationCreateInput
): Promise<MachineReservationViewModel> => {
  const reservationInterval: DateInterval = {
    start: input.startsAt,
    end: addMinutesToDate(input.startsAt, input.durationMinutes)
  };

  assertReservationInterval(reservationInterval, `machineId=${input.machineId}`);
  if (isReservationSlotInPast(reservationInterval.start)) {
    throw new Error('machineReservation.startsAtInPast');
  }

  const hasOverlap = await machineReservationRepository.hasOverlap(
    input.machineId,
    reservationInterval.start,
    reservationInterval.end
  );
  if (hasOverlap) {
    throw new Error('machineReservation.overlap');
  }

  const participantIds = Array.from(
    new Set((input.participantIds ?? []).filter((participantId) => participantId !== input.creatorId))
  );
  const reservation = await machineReservationRepository.createMachineReservation({
    machineId: input.machineId,
    creatorId: input.creatorId,
    startsAt: reservationInterval.start,
    endsAt: reservationInterval.end,
    participantIds
  });

  return mapMachineReservationToViewModel(reservation);
};
