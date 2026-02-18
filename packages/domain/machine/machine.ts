import type { ActivityStatus } from '../activity-status';
import { isInactive } from '../activity-status';
import type { DateInterval } from '../date-interval';
import type { OpenBadgeRequirement } from '../badge/open-badge-requirement';
import {
  MachineAvailability,
  resolveMachineAvailability,
  resolveMachineAvailabilityFromActivityStatus
} from './machine-availability';
import {
  MachineReservationStatus,
  isReservationConfirmed,
  toMachineReservationStatus
} from './machine-reservation-status';
import {
  assertReservationInterval,
  intervalOverlapsAny,
  isReservationSlotInPast,
  reservationWindowFor
} from './reservation-rules';
import { MachineReservationError } from './machine-reservation-errors';
import { uniqueParticipantIds } from './machine-reservation-participants';

export type MachineReservationSlot = {
  id: string;
  startsAt: Date;
  endsAt: Date;
  status: MachineReservationStatus;
};

export type MachineReservationCommand = {
  creatorId: string;
  startsAt: Date;
  durationMinutes: number;
  participantIds?: string[];
};

export const MachineReservationSlot = {
  from(input: {
    id: string;
    startsAt: Date;
    endsAt: Date;
    status: MachineReservationStatus | string;
  }): MachineReservationSlot {
    return {
      id: input.id,
      startsAt: input.startsAt,
      endsAt: input.endsAt,
      status: toMachineReservationStatus(input.status)
    };
  }
};

export type Machine = {
  id: string;
  name: string;
  category: string;
  status: ActivityStatus;
  description?: string | null;
  imageUrl?: string | null;
  roomName?: string | null;
  badgeRequirements: OpenBadgeRequirement[];
  reservations: MachineReservationSlot[];
};

export type ReservationCandidate = {
  startsAt: Date;
  endsAt: Date;
  status?: MachineReservationStatus | string;
  id?: string;
};

const toInterval = (reservation: { startsAt: Date; endsAt: Date }): DateInterval => ({
  start: reservation.startsAt,
  end: reservation.endsAt
});

const resolveReservationStatus = (status?: MachineReservationStatus | string): MachineReservationStatus =>
  status ? toMachineReservationStatus(status) : MachineReservationStatus.Confirmed;

const listConfirmedIntervals = (
  reservations: MachineReservationSlot[],
  excludeId?: string
): DateInterval[] =>
  reservations
    .filter((reservation) => (excludeId ? reservation.id !== excludeId : true))
    .filter((reservation) => isReservationConfirmed(reservation.status))
    .map((reservation) => toInterval(reservation));

export const Machine = {
  from(input: Omit<Machine, 'badgeRequirements' | 'reservations'> & {
    badgeRequirements?: OpenBadgeRequirement[];
    reservations?: MachineReservationSlot[];
  }): Machine {
    return {
      ...input,
      badgeRequirements: input.badgeRequirements ?? [],
      reservations: input.reservations ?? []
    };
  },
  createReservationCandidate(
    startsAt: Date,
    durationMinutes: number,
    status?: MachineReservationStatus | string
  ): ReservationCandidate {
    const interval = reservationWindowFor(startsAt, durationMinutes);
    return {
      startsAt: interval.start,
      endsAt: interval.end,
      status
    };
  },
  planReservation(input: MachineReservationCommand): {
    candidate: ReservationCandidate;
    participantIds: string[];
  } {
    const candidate = Machine.createReservationCandidate(input.startsAt, input.durationMinutes);
    return {
      candidate,
      participantIds: uniqueParticipantIds(input.participantIds, input.creatorId)
    };
  },
  assertReservable(machine: Machine): void {
    if (isInactive(machine.status)) {
      throw new MachineReservationError('machineReservation.inactive');
    }
  },
  assertReservationInterval(candidate: ReservationCandidate, context?: string): void {
    assertReservationInterval(toInterval(candidate), context);
  },
  assertReservationNotInPast(candidate: ReservationCandidate, now: Date = new Date()): void {
    if (isReservationSlotInPast(candidate.startsAt, now)) {
      throw new MachineReservationError('machineReservation.startsAtInPast');
    }
  },
  assertNoOverlap(
    machine: Machine,
    candidate: ReservationCandidate,
    options?: { excludeReservationId?: string }
  ): void {
    const status = resolveReservationStatus(candidate.status);
    if (!isReservationConfirmed(status)) {
      return;
    }

    const interval = toInterval(candidate);
    const existing = listConfirmedIntervals(machine.reservations, options?.excludeReservationId);
    if (intervalOverlapsAny(interval, existing)) {
      throw new MachineReservationError('machineReservation.overlap');
    }
  },
  assertCanReserve(
    machine: Machine,
    candidate: ReservationCandidate,
    now: Date = new Date(),
    options?: { excludeReservationId?: string }
  ): void {
    Machine.assertReservable(machine);
    Machine.assertReservationInterval(candidate, 'reserve');
    Machine.assertReservationNotInPast(candidate, now);
    Machine.assertNoOverlap(machine, candidate, options);
  },
  canReserve(
    machine: Machine,
    candidate: ReservationCandidate,
    now: Date = new Date(),
    options?: { excludeReservationId?: string }
  ): boolean {
    try {
      Machine.assertCanReserve(machine, candidate, now, options);
      return true;
    } catch {
      return false;
    }
  },
  reserve(machine: Machine, reservation: MachineReservationSlot, now: Date = new Date()): Machine {
    Machine.assertCanReserve(machine, reservation, now);
    return {
      ...machine,
      reservations: [...machine.reservations, reservation]
    };
  },
  cancelReservation(machine: Machine, reservationId: string): Machine {
    if (!machine.reservations.some((reservation) => reservation.id === reservationId)) {
      throw new MachineReservationError('machineReservation.notFound');
    }

    return {
      ...machine,
      reservations: machine.reservations.map((reservation) =>
        reservation.id === reservationId
          ? { ...reservation, status: MachineReservationStatus.Cancelled }
          : reservation
      )
    };
  },
  resolveAvailability(machine: Machine, now: Date, dayEnd: Date): MachineAvailability {
    const baseAvailability = resolveMachineAvailabilityFromActivityStatus(machine.status);
    const reservations = machine.reservations.map((reservation) => ({
      startsAt: reservation.startsAt,
      endsAt: reservation.endsAt,
      status: reservation.status
    }));
    return resolveMachineAvailability(baseAvailability, reservations, now, dayEnd);
  }
};
