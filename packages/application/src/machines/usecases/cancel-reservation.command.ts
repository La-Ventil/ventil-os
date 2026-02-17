import { machineReservationRepository } from '@repo/db';
import type { MachineReservationViewModel } from '@repo/view-models/machine-reservation';
import { MachineReservation } from '@repo/domain/machine/machine-reservation';
import { mapMachineReservationToViewModel } from '../../presenters/machine-reservation';
import { canManageReservations } from '../../authorization';
import type { Command } from '../../usecase';

export type CancelReservationResult =
  | { ok: true; reservation: MachineReservationViewModel }
  | { ok: false; reason: 'not-found' | 'unauthorized' };

type CancelReservationArgs = [
  reservationId: string,
  currentUser?: { id?: string; globalAdmin?: boolean; pedagogicalAdmin?: boolean } | null
];

export const cancelReservation: Command<CancelReservationArgs, CancelReservationResult> = async (
  reservationId: string,
  currentUser?: { id?: string; globalAdmin?: boolean; pedagogicalAdmin?: boolean } | null
) => {
  const reservation = await machineReservationRepository.getById(reservationId);
  if (!reservation) {
    return { ok: false, reason: 'not-found' };
  }

  const canCancel =
    Boolean(currentUser?.id) && (currentUser?.id === reservation.creator.id || canManageReservations(currentUser));

  if (!canCancel) {
    return { ok: false, reason: 'unauthorized' };
  }

  if (MachineReservation.isCancelled(reservation)) {
    return { ok: true, reservation: mapMachineReservationToViewModel(reservation) };
  }

  const updated = await machineReservationRepository.cancelReservation(reservationId);
  return { ok: true, reservation: mapMachineReservationToViewModel(updated) };
};
