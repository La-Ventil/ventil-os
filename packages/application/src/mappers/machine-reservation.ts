import type { MachineReservationSchema } from '@repo/db/schemas';
import { MachineReservationStatus, type MachineReservationViewModel } from '@repo/view-models/machine-reservation';
import { assertReservationInterval } from '../machine-reservation-schedule';
import { mapUserSummaryToViewModel } from './user-summary';

export const mapMachineReservationToViewModel = (
  reservation: MachineReservationSchema
): MachineReservationViewModel => {
  assertReservationInterval(
    { start: reservation.startsAt, end: reservation.endsAt },
    `reservationId=${reservation.id}`
  );

  const status =
    reservation.status === 'confirmed' ? MachineReservationStatus.Confirmed : MachineReservationStatus.Cancelled;

  return {
    id: reservation.id,
    machineId: reservation.machineId,
    creator: mapUserSummaryToViewModel(reservation.creator),
    participants: reservation.participants.map((participant) => ({
      id: participant.id,
      user: mapUserSummaryToViewModel(participant.user)
    })),
    startsAt: reservation.startsAt,
    endsAt: reservation.endsAt,
    status
  };
};
