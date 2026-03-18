import type { MachineReservation, MachineReservationParticipant } from '@repo/domain/machine/machine-reservation';
import type { UserSummaryViewModel } from './user-summary';
export { MachineReservationStatus } from '@repo/domain/machine/machine-reservation-status';

export type MachineReservationParticipantViewModel = Omit<MachineReservationParticipant, 'user'> & {
  user: UserSummaryViewModel;
};

export type MachineReservationViewModel = Omit<MachineReservation, 'creator' | 'participants'> & {
  creator: UserSummaryViewModel;
  participants: MachineReservationParticipantViewModel[];
};
