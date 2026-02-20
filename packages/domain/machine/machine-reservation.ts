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

export const MachineReservation = {
  isCancelled(reservation: MachineReservation): boolean {
    return reservation.status === MachineReservationStatus.Cancelled;
  },
  isConfirmed(reservation: MachineReservation): boolean {
    return isReservationConfirmed(reservation.status);
  },
  hasStarted(reservation: MachineReservation, now: Date = new Date()): boolean {
    return now.getTime() >= reservation.startsAt.getTime();
  },
  hasEnded(reservation: MachineReservation, now: Date = new Date()): boolean {
    return now.getTime() >= reservation.endsAt.getTime();
  },
  isUpcoming(reservation: MachineReservation, now: Date = new Date()): boolean {
    return MachineReservation.isConfirmed(reservation) && now.getTime() < reservation.startsAt.getTime();
  },
  isActive(reservation: MachineReservation, now: Date = new Date()): boolean {
    if (!MachineReservation.isConfirmed(reservation)) {
      return false;
    }

    const nowMs = now.getTime();
    return nowMs >= reservation.startsAt.getTime() && nowMs < reservation.endsAt.getTime();
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
