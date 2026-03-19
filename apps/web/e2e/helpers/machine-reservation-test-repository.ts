import type { Prisma, PrismaClient } from '@prisma/client';
import type { DateInterval } from '@repo/domain/date-interval';
import { reservationWindowFor } from '@repo/domain/machine/reservation-rules';
import { getE2EPrismaClient } from './e2e-prisma';

type SetLatestConfirmedReservationTimingInput = {
  creatorEmail?: string;
};

type CreateConfirmedReservationInput = {
  machineName: string;
  creatorEmail: string;
  startsAt: Date;
  durationMinutes: number;
  participantEmails?: string[];
};

const MINUTE_MS = 60_000;

const reservationFixtureWindowFromOffset = (
  startsAtOffsetMinutes: number,
  durationMinutes: number,
  now: Date = new Date()
): DateInterval => {
  const startsAt = new Date(now.getTime() + startsAtOffsetMinutes * MINUTE_MS);
  return reservationWindowFor(startsAt, durationMinutes);
};

const activeReservationFixtureWindow = (now: Date): DateInterval => reservationFixtureWindowFromOffset(-5, 15, now);

const upcomingReservationFixtureWindow = (now: Date): DateInterval => reservationFixtureWindowFromOffset(30, 15, now);

const pastReservationFixtureWindow = (now: Date): DateInterval => reservationFixtureWindowFromOffset(-45, 15, now);

export class MachineReservationTestRepository {
  constructor(private readonly prisma: PrismaClient) {}

  private async requireMachineIdByName(machineName: string): Promise<string> {
    const machine = await this.prisma.machine.findFirst({
      where: { name: machineName },
      select: { id: true }
    });

    if (!machine) {
      throw new Error(`No machine found for name ${machineName}`);
    }

    return machine.id;
  }

  private async requireUserIdByEmail(email: string): Promise<string> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true }
    });

    if (!user) {
      throw new Error(`No user found for email ${email}`);
    }

    return user.id;
  }

  async createConfirmedReservation(input: CreateConfirmedReservationInput): Promise<string> {
    const machineId = await this.requireMachineIdByName(input.machineName);
    const creatorId = await this.requireUserIdByEmail(input.creatorEmail);
    const participantIds = await Promise.all(
      (input.participantEmails ?? []).map((email) => this.requireUserIdByEmail(email))
    );
    const window = reservationWindowFor(input.startsAt, input.durationMinutes);

    // Reservation journeys reuse the seeded DB across specs. Clear prior reservations
    // on the target machine so fixture setup stays deterministic and avoids overlap
    // with seeded or previously-created reservations.
    await this.prisma.machineReservation.deleteMany({
      where: {
        machineId
      }
    });

    const reservation = await this.prisma.machineReservation.create({
      data: {
        machineId,
        creatorId,
        startsAt: window.start,
        endsAt: window.end,
        status: 'confirmed',
        participants: participantIds.length
          ? {
              create: participantIds.map((userId) => ({ userId }))
            }
          : undefined
      },
      select: {
        id: true
      }
    });

    return reservation.id;
  }

  async getLatestConfirmedReservationId(input: SetLatestConfirmedReservationTimingInput): Promise<string> {
    const where: Prisma.MachineReservationWhereInput = {
      status: 'confirmed',
      ...(input.creatorEmail
        ? {
            creator: {
              email: input.creatorEmail
            }
          }
        : {})
    };

    const latestReservation = await this.prisma.machineReservation.findFirst({
      where,
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true
      }
    });

    if (!latestReservation) {
      const detail = input.creatorEmail ? ` for creator email ${input.creatorEmail}` : '';
      throw new Error(`No confirmed reservation found${detail}`);
    }

    return latestReservation.id;
  }

  async getReservationWindow(reservationId: string): Promise<DateInterval> {
    const reservation = await this.prisma.machineReservation.findUnique({
      where: { id: reservationId },
      select: {
        startsAt: true,
        endsAt: true
      }
    });

    if (!reservation) {
      throw new Error(`No reservation found for id ${reservationId}`);
    }

    return {
      start: reservation.startsAt,
      end: reservation.endsAt
    };
  }

  async setLatestConfirmedReservationWindow(
    input: SetLatestConfirmedReservationTimingInput,
    window: DateInterval
  ): Promise<void> {
    const reservationId = await this.getLatestConfirmedReservationId(input);

    await this.prisma.machineReservation.update({
      where: {
        id: reservationId
      },
      data: {
        startsAt: window.start,
        endsAt: window.end
      }
    });
  }

  async setLatestConfirmedReservationActiveNow(
    input: SetLatestConfirmedReservationTimingInput,
    now: Date = new Date()
  ): Promise<void> {
    return this.setLatestConfirmedReservationWindow(input, activeReservationFixtureWindow(now));
  }

  async setLatestConfirmedReservationUpcomingSoon(
    input: SetLatestConfirmedReservationTimingInput,
    now: Date = new Date()
  ): Promise<void> {
    return this.setLatestConfirmedReservationWindow(input, upcomingReservationFixtureWindow(now));
  }

  async setLatestConfirmedReservationPast(
    input: SetLatestConfirmedReservationTimingInput,
    now: Date = new Date()
  ): Promise<void> {
    return this.setLatestConfirmedReservationWindow(input, pastReservationFixtureWindow(now));
  }

  async cancelLatestConfirmedReservation(input: SetLatestConfirmedReservationTimingInput): Promise<string> {
    const reservationId = await this.getLatestConfirmedReservationId(input);
    await this.cancelReservation(reservationId);
    return reservationId;
  }

  async cancelReservation(reservationId: string): Promise<void> {
    await this.prisma.machineReservation.update({
      where: {
        id: reservationId
      },
      data: {
        status: 'cancelled'
      }
    });
  }
}

const machineReservationTestRepositoriesBySlot = new Map<string, MachineReservationTestRepository>();

export const getMachineReservationTestRepository = (dbSlot?: string): MachineReservationTestRepository => {
  const key = dbSlot?.trim() || process.env.PLAYWRIGHT_DB_SLOT?.trim() || 'default';
  const cachedRepository = machineReservationTestRepositoriesBySlot.get(key);

  if (cachedRepository) {
    return cachedRepository;
  }

  const repository = new MachineReservationTestRepository(getE2EPrismaClient(key));
  machineReservationTestRepositoriesBySlot.set(key, repository);
  return repository;
};
