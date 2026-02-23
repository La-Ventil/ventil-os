import type { UserSummary } from '../user/user-summary';
import { isReservationConfirmed, MachineReservationStatus } from './machine-reservation-status';

export type MachineReservationParticipant = {
  id: string;
  user: UserSummary;
};

export type MachineReservation = {
  id: string;
  machineId: string;
  creator: UserSummary;
  participants: MachineReservationParticipant[];
  startsAt: Date;
  endsAt: Date;
  status: MachineReservationStatus;
};

type ReservationStatusRef = Pick<MachineReservation, 'status'>;
type ReservationTimeRef = Pick<MachineReservation, 'startsAt' | 'endsAt' | 'status'>;
type ReservationStartRef = Pick<MachineReservation, 'startsAt'>;
type ReservationEndRef = Pick<MachineReservation, 'endsAt'>;

export const MachineReservation = {
  isCancelled(reservation: ReservationStatusRef): boolean {
    return reservation.status === MachineReservationStatus.Cancelled;
  },
  isConfirmed(reservation: ReservationStatusRef): boolean {
    return isReservationConfirmed(reservation.status);
  },
  hasStarted(reservation: ReservationStartRef, now: Date = new Date()): boolean {
    return now.getTime() >= reservation.startsAt.getTime();
  },
  hasEnded(reservation: ReservationEndRef, now: Date = new Date()): boolean {
    return now.getTime() >= reservation.endsAt.getTime();
  },
  isUpcoming(reservation: ReservationTimeRef, now: Date = new Date()): boolean {
    return MachineReservation.isConfirmed(reservation) && now.getTime() < reservation.startsAt.getTime();
  },
  isActive(reservation: ReservationTimeRef, now: Date = new Date()): boolean {
    if (!MachineReservation.isConfirmed(reservation)) {
      return false;
    }

    const nowMs = now.getTime();
    return nowMs >= reservation.startsAt.getTime() && nowMs < reservation.endsAt.getTime();
  },
  durationMinutes(reservation: Pick<MachineReservation, 'startsAt' | 'endsAt'>): number {
    return Math.max(1, Math.round((reservation.endsAt.getTime() - reservation.startsAt.getTime()) / 60000));
  },
  cancel(reservation: MachineReservation): MachineReservation {
    if (MachineReservation.isCancelled(reservation)) {
      return reservation;
    }

    return {
      ...reservation,
      status: MachineReservationStatus.Cancelled
    };
  }
};
