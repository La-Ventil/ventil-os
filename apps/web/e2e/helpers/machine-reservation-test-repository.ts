import type { Prisma, PrismaClient } from '@prisma/client';
import { getE2EPrismaClient } from './e2e-prisma';

type ReservationTimingPreset = 'upcoming' | 'active';

type SetLatestConfirmedReservationTimingInput = {
  creatorEmail?: string;
};

const toReservationWindow = (preset: ReservationTimingPreset, now: Date): { startsAt: Date; endsAt: Date } => {
  if (preset === 'active') {
    return {
      startsAt: new Date(now.getTime() - 5 * 60_000),
      endsAt: new Date(now.getTime() + 10 * 60_000)
    };
  }

  return {
    startsAt: new Date(now.getTime() + 30 * 60_000),
    endsAt: new Date(now.getTime() + 45 * 60_000)
  };
};

export class MachineReservationTestRepository {
  constructor(private readonly prisma: PrismaClient) {}

  private async findLatestConfirmedReservationId(input: SetLatestConfirmedReservationTimingInput): Promise<string> {
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

  async setLatestConfirmedReservationTiming(
    input: SetLatestConfirmedReservationTimingInput,
    preset: ReservationTimingPreset
  ): Promise<void> {
    const reservationId = await this.findLatestConfirmedReservationId(input);
    const { startsAt, endsAt } = toReservationWindow(preset, new Date());

    await this.prisma.machineReservation.update({
      where: {
        id: reservationId
      },
      data: {
        startsAt,
        endsAt
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

