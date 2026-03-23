import { machineReservationRepository } from '@repo/db';
import type { MachineReservationViewModel } from '@repo/application/machines/models/machine-reservation';
import { MachineReservation } from '@repo/domain/machine/machine-reservation';
import { MachineReservationError } from '@repo/domain/machine/machine-reservation-errors';
import { canCancelReservation } from '@repo/domain/machine/machine-reservation-cancellation-policy';
import { mapMachineReservationToViewModel } from '../../presenters/machine-reservation';
import type { Command } from '../../usecase';

type ReleaseReservationArgs = [
  reservationId: string,
  currentUser?: { id?: string; globalAdmin?: boolean; pedagogicalAdmin?: boolean } | null
];

export const releaseReservation: Command<ReleaseReservationArgs, MachineReservationViewModel> = async (
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

  const now = new Date();
  MachineReservation.assertCanRelease(reservation, now);

  const updated = await machineReservationRepository.releaseReservation(reservationId, now);
  return mapMachineReservationToViewModel(updated);
};
