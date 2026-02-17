import { MachineReservationStatus, isReservationConfirmed } from './machine-reservation-status';
import { isInactive } from '../activity-status';

export enum MachineAvailability {
  Available = 'available',
  Reserved = 'reserved',
  Occupied = 'occupied'
}

export type ReservationWindow = {
  startsAt: Date;
  endsAt: Date;
  status: MachineReservationStatus;
};

export const resolveMachineAvailability = (
  baseAvailability: MachineAvailability,
  reservations: ReservationWindow[],
  now: Date,
  dayEnd: Date
): MachineAvailability => {
  if (baseAvailability === MachineAvailability.Occupied) {
    return baseAvailability;
  }

  const confirmed = reservations.filter((reservation) => isReservationConfirmed(reservation.status));
  const isOccupied = confirmed.some((reservation) => reservation.startsAt <= now && reservation.endsAt > now);
  if (isOccupied) {
    return MachineAvailability.Occupied;
  }

  const hasUpcoming = confirmed.some((reservation) => reservation.startsAt > now && reservation.startsAt < dayEnd);
  if (hasUpcoming) {
    return MachineAvailability.Reserved;
  }

  return MachineAvailability.Available;
};

export const resolveMachineAvailabilityFromActivityStatus = (status: string): MachineAvailability =>
  isInactive(status) ? MachineAvailability.Occupied : MachineAvailability.Available;
