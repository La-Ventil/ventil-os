import { canManageReservations, type AdminFlags } from '../authorization';

export type ReservationActor = AdminFlags & {
  id?: string | null;
};

export const canCancelReservation = (
  reservation: { creator: { id: string } },
  actor?: ReservationActor | null
): boolean =>
  Boolean(actor?.id) && (actor?.id === reservation.creator.id || canManageReservations(actor));
