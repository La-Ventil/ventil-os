import type { MachineReservationSchema } from '@repo/db/schemas';
import type { MachineReservationViewModel } from '@repo/view-models/machine-reservation';
import { assertReservationInterval } from '@repo/domain/machine/reservation-rules';
import { mapUserSummaryToViewModel } from './user-summary';

export const mapMachineReservationToViewModel = (
  reservation: MachineReservationSchema
): MachineReservationViewModel => {
  assertReservationInterval(
    { start: reservation.startsAt, end: reservation.endsAt },
    `reservationId=${reservation.id}`
  );

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
    status: reservation.status
  };
};
