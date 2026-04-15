import { machineRepository, machineReservationRepository } from '@repo/db';
import type { MachineReservationViewModel } from '@repo/application/machines/models/machine-reservation';
import { Machine } from '@repo/domain/machine/machine';
import { MachineReservationError } from '@repo/domain/machine/machine-reservation-errors';
import { reservationIntervalFor } from '@repo/domain/machine/reservation-rules';
import type { Command } from '../../usecase';
import { mapMachineReservationToViewModel } from '../../presenters/machine-reservation';
import { resolveReservationEligibilityLevels } from '../reservation-eligibility';

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
  const reservationWindow = reservationIntervalFor(input.startsAt, input.durationMinutes);
  const machine = await machineRepository.getReservableMachine(
    input.machineId,
    reservationWindow.start,
    reservationWindow.end
  );
  if (!machine) {
    throw new MachineReservationError('machineReservation.machineRequired');
  }

  const userLevels = await resolveReservationEligibilityLevels(machine, input.creatorId);
  const { candidate, participantIds } = Machine.planReservation(input);

  Machine.assertCanCreateReservation(machine, candidate, { userLevels, now: new Date() });

  const reservation = await machineReservationRepository.createMachineReservation({
    machineId: input.machineId,
    creatorId: input.creatorId,
    startsAt: candidate.startsAt,
    endsAt: candidate.endsAt,
    participantIds
  });

  return mapMachineReservationToViewModel(reservation);
};
