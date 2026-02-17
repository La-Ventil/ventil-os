import type { Prisma } from '@prisma/client';
import type { MachineReservationStatus } from '@repo/domain/machine/machine-reservation-status';
import type { UserSummarySchema } from './user-summary';

export type MachineReservationSchemaRaw = Prisma.MachineReservationGetPayload<{
  include: {
    creator: {
      select: {
        id: true;
        firstName: true;
        lastName: true;
        username: true;
        image: true;
        email: true;
      };
    };
    participants: {
      select: {
        id: true;
        user: {
          select: {
            id: true;
            firstName: true;
            lastName: true;
            username: true;
            image: true;
            email: true;
          };
        };
      };
    };
  };
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

export type MachineReservationAvailabilitySchemaRaw = Prisma.MachineReservationGetPayload<{
  select: {
    machineId: true;
    startsAt: true;
    endsAt: true;
    status: true;
  };
}>;

export type MachineReservationAvailabilitySchema = Omit<MachineReservationAvailabilitySchemaRaw, 'status'> & {
  status: MachineReservationStatus;
};
