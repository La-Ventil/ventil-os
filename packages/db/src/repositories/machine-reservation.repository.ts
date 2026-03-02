import type { PrismaClient } from '@prisma/client';
import type {
  MachineReservationAvailabilityReadModel,
  MachineReservationParticipantReadModel,
  MachineReservationReadModel
} from '../read-models/machine-reservation';
import {
  type MachineReservationAvailabilityPayload,
  type MachineReservationPayload,
  machineReservationAvailabilitySelect,
  machineReservationInclude
} from '../selects/machine-reservation';
import { toMachineReservationStatus } from '@repo/domain/machine/machine-reservation-status';
import type { UserSummaryReadModel } from '../read-models/user-summary';
import { Email } from '@repo/domain/user/email';

export class MachineReservationRepository {
  constructor(private prisma: PrismaClient) {}

  private normalizeUserSummary(user: MachineReservationPayload['creator']): UserSummaryReadModel {
    return {
      ...user,
      email: Email.from(user.email),
      lastName: user.lastName
    };
  }

  private normalizeParticipant(
    participant: MachineReservationPayload['participants'][number]
  ): MachineReservationParticipantReadModel {
    return {
      id: participant.id,
      user: this.normalizeUserSummary(participant.user)
    };
  }

  private normalizeReservation(reservation: MachineReservationPayload): MachineReservationReadModel {
    return {
      ...reservation,
      status: toMachineReservationStatus(reservation.status),
      creator: this.normalizeUserSummary(reservation.creator),
      participants: reservation.participants.map((participant) => this.normalizeParticipant(participant))
    };
  }

  private normalizeReservationAvailability(
    reservation: MachineReservationAvailabilityPayload
  ): MachineReservationAvailabilityReadModel {
    return {
      ...reservation,
      status: toMachineReservationStatus(reservation.status)
    };
  }

  async listForMachineBetween(
    machineId: string,
    rangeStart: Date,
    rangeEnd: Date
  ): Promise<MachineReservationReadModel[]> {
    const reservations = await this.prisma.machineReservation.findMany({
      where: {
        machineId,
        status: 'confirmed',
        startsAt: {
          lt: rangeEnd
        },
        endsAt: {
          gt: rangeStart
        }
      },
      include: machineReservationInclude,
      orderBy: {
        startsAt: 'asc'
      }
    });

    return reservations.map((reservation) => this.normalizeReservation(reservation as MachineReservationPayload));
  }

  async createMachineReservation(input: {
    machineId: string;
    creatorId: string;
    startsAt: Date;
    endsAt: Date;
    participantIds?: string[];
  }): Promise<MachineReservationReadModel> {
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
      include: machineReservationInclude
    });

    return this.normalizeReservation(reservation as MachineReservationPayload);
  }

  async listForUser(userId: string): Promise<MachineReservationReadModel[]> {
    const now = new Date();
    const reservations = await this.prisma.machineReservation.findMany({
      where: {
        status: 'confirmed',
        endsAt: {
          gt: now
        },
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
      include: machineReservationInclude,
      orderBy: {
        startsAt: 'asc'
      }
    });

    return reservations.map((reservation) => this.normalizeReservation(reservation as MachineReservationPayload));
  }

  async listForMachinesBetween(rangeStart: Date, rangeEnd: Date): Promise<MachineReservationAvailabilityReadModel[]> {
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
      select: machineReservationAvailabilitySelect
    });

    return reservations.map((reservation) =>
      this.normalizeReservationAvailability(reservation as MachineReservationAvailabilityPayload)
    );
  }

  async getById(reservationId: string): Promise<MachineReservationReadModel | null> {
    const reservation = await this.prisma.machineReservation.findUnique({
      where: { id: reservationId },
      include: machineReservationInclude
    });

    return reservation ? this.normalizeReservation(reservation as MachineReservationPayload) : null;
  }

  async cancelReservation(reservationId: string): Promise<MachineReservationReadModel> {
    const reservation = await this.prisma.machineReservation.update({
      where: { id: reservationId },
      data: {
        status: 'cancelled'
      },
      include: machineReservationInclude
    });

    return this.normalizeReservation(reservation as MachineReservationPayload);
  }

  async releaseReservation(reservationId: string, endsAt: Date): Promise<MachineReservationReadModel> {
    const reservation = await this.prisma.machineReservation.update({
      where: { id: reservationId },
      data: {
        endsAt
      },
      include: machineReservationInclude
    });

    return this.normalizeReservation(reservation as MachineReservationPayload);
  }

  async updateReservation(input: {
    reservationId: string;
    startsAt: Date;
    endsAt: Date;
    participantIds?: string[];
  }): Promise<MachineReservationReadModel> {
    const participantIds = Array.from(new Set(input.participantIds ?? []));
    const reservation = await this.prisma.machineReservation.update({
      where: { id: input.reservationId },
      data: {
        startsAt: input.startsAt,
        endsAt: input.endsAt,
        participants: {
          deleteMany: {},
          create: participantIds.map((userId) => ({ userId }))
        }
      },
      include: machineReservationInclude
    });

    return this.normalizeReservation(reservation as MachineReservationPayload);
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
