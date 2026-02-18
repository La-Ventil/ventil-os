import type { Prisma } from '@prisma/client';
import type { MachineReservationStatus } from '@repo/domain/machine/machine-reservation-status';
import type { UserSummaryReadModel } from './user-summary';
import { userSummarySelect } from './user-summary';

export const machineReservationInclude = {
  creator: {
    select: userSummarySelect
  },
  participants: {
    select: {
      id: true,
      user: {
        select: userSummarySelect
      }
    }
  }
} as const;

export type MachineReservationRow = Prisma.MachineReservationGetPayload<{
  include: typeof machineReservationInclude;
}>;

export type MachineReservationParticipantReadModel = {
  id: string;
  user: UserSummaryReadModel;
};

export type MachineReservationReadModel = Omit<
  MachineReservationRow,
  'status' | 'creator' | 'participants'
> & {
  status: MachineReservationStatus;
  creator: UserSummaryReadModel;
  participants: MachineReservationParticipantReadModel[];
};

export const machineReservationAvailabilitySelect = {
  machineId: true,
  startsAt: true,
  endsAt: true,
  status: true
} as const;

export type MachineReservationAvailabilityRow = Prisma.MachineReservationGetPayload<{
  select: typeof machineReservationAvailabilitySelect;
}>;

export type MachineReservationAvailabilityReadModel = Omit<MachineReservationAvailabilityRow, 'status'> & {
  status: MachineReservationStatus;
};

export const machineReservationSlotSelect = {
  id: true,
  startsAt: true,
  endsAt: true,
  status: true
} as const;

export type MachineReservationSlotRow = Prisma.MachineReservationGetPayload<{
  select: typeof machineReservationSlotSelect;
}>;
