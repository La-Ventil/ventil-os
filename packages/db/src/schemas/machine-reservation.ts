import type { Prisma } from '@prisma/client';
import type { MachineReservationStatus } from '@repo/domain/machine/machine-reservation-status';
import type { UserSummarySchema } from './user-summary';
import { selectUserSummarySchemaRaw } from './user-summary';

export const includeMachineReservationSchemaRaw = {
  creator: {
    select: selectUserSummarySchemaRaw
  },
  participants: {
    select: {
      id: true,
      user: {
        select: selectUserSummarySchemaRaw
      }
    }
  }
} as const;

export type MachineReservationSchemaRaw = Prisma.MachineReservationGetPayload<{
  include: typeof includeMachineReservationSchemaRaw;
}>;

export type MachineReservationParticipantSchema = {
  id: string;
  user: UserSummarySchema;
};

export type MachineReservationSchema = Omit<
  MachineReservationSchemaRaw,
  'status' | 'creator' | 'participants'
> & {
  status: MachineReservationStatus;
  creator: UserSummarySchema;
  participants: MachineReservationParticipantSchema[];
};

export const selectMachineReservationAvailabilitySchemaRaw = {
  machineId: true,
  startsAt: true,
  endsAt: true,
  status: true
} as const;

export type MachineReservationAvailabilitySchemaRaw = Prisma.MachineReservationGetPayload<{
  select: typeof selectMachineReservationAvailabilitySchemaRaw;
}>;

export type MachineReservationAvailabilitySchema = Omit<MachineReservationAvailabilitySchemaRaw, 'status'> & {
  status: MachineReservationStatus;
};

export const selectMachineReservationSlotSchemaRaw = {
  id: true,
  startsAt: true,
  endsAt: true,
  status: true
} as const;

export type MachineReservationSlotSchemaRaw = Prisma.MachineReservationGetPayload<{
  select: typeof selectMachineReservationSlotSchemaRaw;
}>;
