import { canManageReservations, type AdminFlags } from '../authorization';
import type { MachineReservation as MachineReservationRecord } from './machine-reservation';
import { MachineReservation } from './machine-reservation';

export type ReservationActor = AdminFlags & {
  id?: string | null;
};

export const canCancelReservation = (
  reservation: { creator: { id: string } },
  actor?: ReservationActor | null
): boolean =>
  Boolean(actor?.id) && (actor?.id === reservation.creator.id || canManageReservations(actor));

type ReservationTiming = Pick<MachineReservationRecord, 'startsAt' | 'endsAt' | 'status'> & {
  creator: { id: string };
};

export const canCancelReservationNow = (
  reservation: ReservationTiming,
  actor?: ReservationActor | null,
  now: Date = new Date()
): boolean => canCancelReservation(reservation, actor) && MachineReservation.isUpcoming(reservation, now);

export const canReleaseReservationNow = (
  reservation: ReservationTiming,
  actor?: ReservationActor | null,
  now: Date = new Date()
): boolean => canCancelReservation(reservation, actor) && MachineReservation.isActive(reservation, now);

export const canViewReservation = (
  reservation: { creator: { id: string } },
  actor?: ReservationActor | null
): boolean => canCancelReservation(reservation, actor);

export const canEditReservation = (
  reservation: ReservationTiming,
  actor?: ReservationActor | null,
  now: Date = new Date()
): boolean => canCancelReservation(reservation, actor) && MachineReservation.isUpcoming(reservation, now);
