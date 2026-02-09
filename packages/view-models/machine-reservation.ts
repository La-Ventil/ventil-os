import type { UserSummaryViewModel } from './user-summary';

export enum MachineReservationStatus {
  Confirmed = 'confirmed',
  Cancelled = 'cancelled'
}

export type MachineReservationParticipantViewModel = {
  id: string;
  user: UserSummaryViewModel;
};

export type MachineReservationViewModel = {
  id: string;
  machineId: string;
  creator: UserSummaryViewModel;
  participants: MachineReservationParticipantViewModel[];
  startsAt: Date;
  endsAt: Date;
  status: MachineReservationStatus;
};
