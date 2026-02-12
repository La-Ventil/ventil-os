import type { DayKey } from './date-time';
import { addMinutesToDate, formatDayKey, getDayIntervalForDayKey } from './date-time';
import { machineReservationRepository, machineRepository, openBadgeRepository } from '@repo/db';
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

export const listMachineReservationsForUser = async (
  userId: string
): Promise<MachineReservationViewModel[]> => {
  const reservations = await machineReservationRepository.listForUser(userId);
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
  const canReserve = await canUserReserveMachine(input.machineId, input.creatorId);
  if (!canReserve) {
    throw new Error('machineReservation.badgeRequired');
  }

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

export const canUserReserveMachine = async (machineId: string, userId?: string | null): Promise<boolean> => {
  const machine = await machineRepository.getMachineDetailsById(machineId);
  if (!machine) {
    return false;
  }

  if (!machine.badgeRequirements.length) {
    return true;
  }

  if (!userId) {
    return false;
  }

  const requiresAny = machine.badgeRequirements.some((requirement) => requirement.ruleType === 'any');
  const checks = await Promise.all(
    machine.badgeRequirements.map(async (requirement) => {
      const requiredLevel = requirement.requiredOpenBadgeLevel?.level ?? 0;
      const highestLevel = await openBadgeRepository.getUserHighestOpenBadgeLevel(
        userId,
        requirement.requiredOpenBadgeId
      );
      if (highestLevel === null) {
        return false;
      }
      return highestLevel >= requiredLevel;
    })
  );

  return requiresAny ? checks.some(Boolean) : checks.every(Boolean);
};
