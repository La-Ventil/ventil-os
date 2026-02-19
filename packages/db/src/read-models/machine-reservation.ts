import type { MachineReservationStatus } from '@repo/domain/machine/machine-reservation-status';
import type { UserSummaryReadModel } from './user-summary';
import type { MachineReservationAvailabilityPayload, MachineReservationPayload } from '../selects/machine-reservation';

export type MachineReservationParticipantReadModel = {
  id: string;
  user: UserSummaryReadModel;
};

export type MachineReservationReadModel = Omit<
  MachineReservationPayload,
  'status' | 'creator' | 'participants'
> & {
  status: MachineReservationStatus;
  creator: UserSummaryReadModel;
  participants: MachineReservationParticipantReadModel[];
};

export type MachineReservationAvailabilityReadModel = Omit<MachineReservationAvailabilityPayload, 'status'> & {
  status: MachineReservationStatus;
};
