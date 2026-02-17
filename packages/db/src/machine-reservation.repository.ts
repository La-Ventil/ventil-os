import type { PrismaClient } from '@prisma/client';
import {
  type MachineReservationAvailabilitySchema,
  type MachineReservationAvailabilitySchemaRaw,
  type MachineReservationParticipantSchema,
  type MachineReservationSchema,
  type MachineReservationSchemaRaw
} from './schemas/machine-reservation';
import { toMachineReservationStatus } from '@repo/domain/machine/machine-reservation-status';
import type { UserSummarySchema } from './schemas/user-summary';
import { Email } from '@repo/domain/user/email';

export class MachineReservationRepository {
  constructor(private prisma: PrismaClient) {}

  private normalizeUserSummary(user: MachineReservationSchemaRaw['creator']): UserSummarySchema {
    return {
      ...user,
      email: Email.from(user.email)
    };
  }

  private normalizeParticipant(
    participant: MachineReservationSchemaRaw['participants'][number]
  ): MachineReservationParticipantSchema {
    return {
      id: participant.id,
      user: this.normalizeUserSummary(participant.user)
    };
  }

  private normalizeReservation(reservation: MachineReservationSchemaRaw): MachineReservationSchema {
    return {
      ...reservation,
      status: toMachineReservationStatus(reservation.status),
      creator: this.normalizeUserSummary(reservation.creator),
      participants: reservation.participants.map((participant) => this.normalizeParticipant(participant))
    };
  }

  private normalizeReservationAvailability(
    reservation: MachineReservationAvailabilitySchemaRaw
  ): MachineReservationAvailabilitySchema {
    return {
      ...reservation,
      status: toMachineReservationStatus(reservation.status)
    };
  }

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

    return reservations.map((reservation) => this.normalizeReservation(reservation as MachineReservationSchemaRaw));
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

    return this.normalizeReservation(reservation as MachineReservationSchemaRaw);
  }

  async listForUser(userId: string): Promise<MachineReservationSchema[]> {
    const reservations = await this.prisma.machineReservation.findMany({
      where: {
        OR: [
          { creatorId: userId },
          {
            participants: {
              some: {
                userId
              }
            }
          }
        ]
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

    return reservations.map((reservation) => this.normalizeReservation(reservation as MachineReservationSchemaRaw));
  }

  async listForMachinesBetween(rangeStart: Date, rangeEnd: Date): Promise<MachineReservationAvailabilitySchema[]> {
    const reservations = await this.prisma.machineReservation.findMany({
      where: {
        status: 'confirmed',
        startsAt: {
          lt: rangeEnd
        },
        endsAt: {
          gt: rangeStart
        }
      },
      select: {
        machineId: true,
        startsAt: true,
        endsAt: true,
        status: true
      }
    });

    return reservations.map((reservation) =>
      this.normalizeReservationAvailability(reservation as MachineReservationAvailabilitySchemaRaw)
    );
  }

  async getById(reservationId: string): Promise<MachineReservationSchema | null> {
    const reservation = await this.prisma.machineReservation.findUnique({
      where: { id: reservationId },
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

    return reservation ? this.normalizeReservation(reservation as MachineReservationSchemaRaw) : null;
  }

  async cancelReservation(reservationId: string): Promise<MachineReservationSchema> {
    const reservation = await this.prisma.machineReservation.update({
      where: { id: reservationId },
      data: {
        status: 'cancelled'
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

    return this.normalizeReservation(reservation as MachineReservationSchemaRaw);
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
