import type { PrismaClient } from '@prisma/client';
import {
  type MachineReservationAvailabilityReadModel,
  type MachineReservationAvailabilityRow,
  type MachineReservationParticipantReadModel,
  type MachineReservationReadModel,
  type MachineReservationRow
} from '../schemas/machine-reservation';
import {
  machineReservationInclude,
  machineReservationAvailabilitySelect
} from '../schemas/machine-reservation';
import { toMachineReservationStatus } from '@repo/domain/machine/machine-reservation-status';
import type { UserSummaryReadModel } from '../schemas/user-summary';
import { Email } from '@repo/domain/user/email';

export class MachineReservationRepository {
  constructor(private prisma: PrismaClient) {}

  private normalizeUserSummary(user: MachineReservationRow['creator']): UserSummaryReadModel {
    return {
      ...user,
      email: Email.from(user.email)
    };
  }

  private normalizeParticipant(
    participant: MachineReservationRow['participants'][number]
  ): MachineReservationParticipantReadModel {
    return {
      id: participant.id,
      user: this.normalizeUserSummary(participant.user)
    };
  }

  private normalizeReservation(reservation: MachineReservationRow): MachineReservationReadModel {
    return {
      ...reservation,
      status: toMachineReservationStatus(reservation.status),
      creator: this.normalizeUserSummary(reservation.creator),
      participants: reservation.participants.map((participant) => this.normalizeParticipant(participant))
    };
  }

  private normalizeReservationAvailability(
    reservation: MachineReservationAvailabilityRow
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

    return reservations.map((reservation) => this.normalizeReservation(reservation as MachineReservationRow));
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

    return this.normalizeReservation(reservation as MachineReservationRow);
  }

  async listForUser(userId: string): Promise<MachineReservationReadModel[]> {
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
      include: machineReservationInclude,
      orderBy: {
        startsAt: 'asc'
      }
    });

    return reservations.map((reservation) => this.normalizeReservation(reservation as MachineReservationRow));
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
      this.normalizeReservationAvailability(reservation as MachineReservationAvailabilityRow)
    );
  }

  async getById(reservationId: string): Promise<MachineReservationReadModel | null> {
    const reservation = await this.prisma.machineReservation.findUnique({
      where: { id: reservationId },
      include: machineReservationInclude
    });

    return reservation ? this.normalizeReservation(reservation as MachineReservationRow) : null;
  }

  async cancelReservation(reservationId: string): Promise<MachineReservationReadModel> {
    const reservation = await this.prisma.machineReservation.update({
      where: { id: reservationId },
      data: {
        status: 'cancelled'
      },
      include: machineReservationInclude
    });

    return this.normalizeReservation(reservation as MachineReservationRow);
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
