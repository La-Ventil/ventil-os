import { machineRepository, machineReservationRepository } from '@repo/db';
import type { MachineReservationViewModel } from '@repo/view-models/machine-reservation';
import { createReservationInterval } from '@repo/domain/machine/reservation-rules';
import { Machine } from '@repo/domain/machine/machine';
import type { Command } from '../../usecase';
import { uniqueValuesWithout } from '../../utils/collection';
import { mapMachineReservationToViewModel } from '../../presenters/machine-reservation';
import { checkReservationEligibility } from './check-reservation-eligibility.query';
import { buildMachineAggregate } from '../machine-aggregate';

export type ReserveMachineInput = {
  machineId: string;
  creatorId: string;
  startsAt: Date;
  durationMinutes: number;
  participantIds?: string[];
};

export const reserveMachine: Command<[ReserveMachineInput], MachineReservationViewModel> = async (
  input: ReserveMachineInput
) => {
  const canReserve = await checkReservationEligibility(input.machineId, input.creatorId);
  if (!canReserve) {
    throw new Error('machineReservation.badgeRequired');
  }

  const reservationInterval = createReservationInterval(input.startsAt, input.durationMinutes);
  const machineRecord = await machineRepository.getMachineById(input.machineId);
  if (!machineRecord) {
    throw new Error('machineReservation.machineRequired');
  }

  const existingReservations = await machineReservationRepository.listForMachineBetween(
    input.machineId,
    reservationInterval.start,
    reservationInterval.end
  );

  const machine = buildMachineAggregate(machineRecord, existingReservations);

  Machine.assertCanReserve(machine, {
    startsAt: reservationInterval.start,
    endsAt: reservationInterval.end
  });

  const participantIds = uniqueValuesWithout(input.participantIds, input.creatorId);
  const reservation = await machineReservationRepository.createMachineReservation({
    machineId: input.machineId,
    creatorId: input.creatorId,
    startsAt: reservationInterval.start,
    endsAt: reservationInterval.end,
    participantIds
  });

  return mapMachineReservationToViewModel(reservation);
};
