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
}
