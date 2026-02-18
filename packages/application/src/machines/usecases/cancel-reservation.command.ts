import { machineReservationRepository } from '@repo/db';
import type { MachineReservationViewModel } from '@repo/view-models/machine-reservation';
import { MachineReservation } from '@repo/domain/machine/machine-reservation';
import { MachineReservationError } from '@repo/domain/machine/machine-reservation-errors';
import { canCancelReservation } from '@repo/domain/machine/machine-reservation-cancellation-policy';
import { mapMachineReservationToViewModel } from '../../presenters/machine-reservation';
import type { Command } from '../../usecase';

type CancelReservationArgs = [
  reservationId: string,
  currentUser?: { id?: string; globalAdmin?: boolean; pedagogicalAdmin?: boolean } | null
];

export const cancelReservation: Command<CancelReservationArgs, MachineReservationViewModel> = async (
  reservationId: string,
  currentUser?: { id?: string; globalAdmin?: boolean; pedagogicalAdmin?: boolean } | null
) => {
  const reservation = await machineReservationRepository.getById(reservationId);
  if (!reservation) {
    throw new MachineReservationError('machineReservation.notFound');
  }

  if (!canCancelReservation(reservation, currentUser)) {
    throw new MachineReservationError('machineReservation.unauthorized');
  }

  if (MachineReservation.isCancelled(reservation)) {
    return mapMachineReservationToViewModel(reservation);
  }

  const updated = await machineReservationRepository.cancelReservation(reservationId);
  return mapMachineReservationToViewModel(updated);
};
