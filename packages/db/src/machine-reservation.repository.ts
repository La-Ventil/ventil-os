import type { PrismaClient } from '@prisma/client';
import type { MachineReservationSchema } from './schemas';

export class MachineReservationRepository {
  constructor(private prisma: PrismaClient) {}

  async listForMachineBetween(
    machineId: string,
    rangeStart: Date,
    rangeEnd: Date
  ): Promise<MachineReservationSchema[]> {
    const reservations = await this.prisma.machineReservation.findMany({
      where: {
        machineId,
        startsAt: {
          lt: rangeEnd
        },
        endsAt: {
          gt: rangeStart
        }
      },
      include: {
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
            image: true,
            email: true
          }
        },
        participants: {
          select: {
            id: true,
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                username: true,
                image: true,
                email: true
              }
            }
          }
        }
      },
      orderBy: {
        startsAt: 'asc'
      }
    });

    return reservations as MachineReservationSchema[];
  }

  async createMachineReservation(input: {
    machineId: string;
    creatorId: string;
    startsAt: Date;
    endsAt: Date;
    participantIds?: string[];
  }): Promise<MachineReservationSchema> {
    const participantIds = Array.from(new Set(input.participantIds ?? []));
    const reservation = await this.prisma.machineReservation.create({
      data: {
        machineId: input.machineId,
        creatorId: input.creatorId,
        startsAt: input.startsAt,
        endsAt: input.endsAt,
        participants: participantIds.length
          ? {
              create: participantIds.map((userId) => ({
                userId
              }))
            }
          : undefined
      },
      include: {
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
            image: true,
            email: true
          }
        },
        participants: {
          select: {
            id: true,
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                username: true,
                image: true,
                email: true
              }
            }
          }
        }
      }
    });

    return reservation as MachineReservationSchema;
  }

  async hasOverlap(machineId: string, rangeStart: Date, rangeEnd: Date): Promise<boolean> {
    const count = await this.prisma.machineReservation.count({
      where: {
        machineId,
        status: 'confirmed',
        startsAt: {
          lt: rangeEnd
        },
        endsAt: {
          gt: rangeStart
        }
      }
    });

    return count > 0;
  }
}
