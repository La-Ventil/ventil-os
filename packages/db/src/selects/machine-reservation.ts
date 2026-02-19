import type { Prisma } from '@prisma/client';
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

export type MachineReservationPayload = Prisma.MachineReservationGetPayload<{
  include: typeof machineReservationInclude;
}>;

export const machineReservationAvailabilitySelect = {
  machineId: true,
  startsAt: true,
  endsAt: true,
  status: true
} as const;

export type MachineReservationAvailabilityPayload = Prisma.MachineReservationGetPayload<{
  select: typeof machineReservationAvailabilitySelect;
}>;

export const machineReservationSlotSelect = {
  id: true,
  startsAt: true,
  endsAt: true,
  status: true
} as const;

export type MachineReservationSlotPayload = Prisma.MachineReservationGetPayload<{
  select: typeof machineReservationSlotSelect;
}>;
