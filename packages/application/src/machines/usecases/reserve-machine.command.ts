import { machineRepository, machineReservationRepository } from '@repo/db';
import type { MachineReservationViewModel } from '@repo/view-models/machine-reservation';
import { MachineReservationError } from '@repo/domain/machine/machine-reservation-errors';
import { planReservationForMachine } from '@repo/domain/machine/machine-reservation-plan';
import { reservationWindowFor } from '@repo/domain/machine/reservation-rules';
import type { Command } from '../../usecase';
import { mapMachineReservationToViewModel } from '../../presenters/machine-reservation';
import { assertReservationEligibility } from '../reservation-eligibility';

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
  const reservationWindow = reservationWindowFor(input.startsAt, input.durationMinutes);
  const machine = await machineRepository.getReservableMachine(
    input.machineId,
    reservationWindow.start,
    reservationWindow.end
  );
  if (!machine) {
    throw new MachineReservationError('machineReservation.machineRequired');
  }

  await assertReservationEligibility(machine, input.creatorId);

  const { candidate, participantIds } = planReservationForMachine(machine, input);
  const reservation = await machineReservationRepository.createMachineReservation({
    machineId: input.machineId,
    creatorId: input.creatorId,
    startsAt: candidate.startsAt,
    endsAt: candidate.endsAt,
    participantIds
  });

  return mapMachineReservationToViewModel(reservation);
};
