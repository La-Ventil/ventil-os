import { machineRepository, machineReservationRepository } from '@repo/db';
import type { MachineReservationViewModel } from '@repo/view-models/machine-reservation';
import { MachineReservation } from '@repo/domain/machine/machine-reservation';
import { MachineReservationError } from '@repo/domain/machine/machine-reservation-errors';
import { canCancelReservation } from '@repo/domain/machine/machine-reservation-cancellation-policy';
import { reservationWindowFor } from '@repo/domain/machine/reservation-rules';
import { Machine } from '@repo/domain/machine/machine';
import type { Command } from '../../usecase';
import { mapMachineReservationToViewModel } from '../../presenters/machine-reservation';

export type UpdateReservationInput = {
  reservationId: string;
  startsAt: Date;
  durationMinutes: number;
  participantIds?: string[];
  currentUser?: { id?: string; globalAdmin?: boolean; pedagogicalAdmin?: boolean } | null;
};

export const updateReservation: Command<[UpdateReservationInput], MachineReservationViewModel> = async (
  input: UpdateReservationInput
) => {
  const reservation = await machineReservationRepository.getById(input.reservationId);
  if (!reservation) {
    throw new MachineReservationError('machineReservation.notFound');
  }

  if (!canCancelReservation(reservation, input.currentUser)) {
    throw new MachineReservationError('machineReservation.unauthorized');
  }

  if (MachineReservation.isCancelled(reservation)) {
    throw new MachineReservationError('machineReservation.cancelled');
  }

  if (!MachineReservation.isUpcoming(reservation)) {
    throw new MachineReservationError('machineReservation.alreadyStarted');
  }

  const reservationWindow = reservationWindowFor(input.startsAt, input.durationMinutes);
  const machine = await machineRepository.getReservableMachine(
    reservation.machineId,
    reservationWindow.start,
    reservationWindow.end
  );
  if (!machine) {
    throw new MachineReservationError('machineReservation.machineRequired');
  }

  const { candidate, participantIds } = Machine.planReservation({
    creatorId: reservation.creator.id,
    startsAt: input.startsAt,
    durationMinutes: input.durationMinutes,
    participantIds: input.participantIds
  });

  Machine.assertReservable(machine);
  Machine.assertReservationInterval(candidate, 'update');
  Machine.assertReservationNotInPast(candidate, new Date());
  Machine.assertNoOverlap(machine, candidate, { excludeReservationId: reservation.id });

  const updated = await machineReservationRepository.updateReservation({
    reservationId: reservation.id,
    startsAt: candidate.startsAt,
    endsAt: candidate.endsAt,
    participantIds
  });

  return mapMachineReservationToViewModel(updated);
};
