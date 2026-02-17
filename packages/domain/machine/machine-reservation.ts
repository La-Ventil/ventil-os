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
