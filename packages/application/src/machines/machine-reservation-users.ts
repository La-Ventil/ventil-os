import type { MachineReservationViewModel } from '@repo/view-models/machine-reservation';
import type { UserSummaryViewModel } from '@repo/view-models/user-summary';
import { resolveReservationParticipants } from '@repo/domain/machine/machine-reservation-participants';

export const listMachineReservationUsers = (reservation: MachineReservationViewModel): UserSummaryViewModel[] => {
  const users = reservation.participants.map((participant) => participant.user);
  return resolveReservationParticipants(reservation.creator, users);
};
