import type { PrismaClient } from '@prisma/client';
import type { EventSchema } from './schemas/event';

export class EventRepository {
  constructor(private prisma: PrismaClient) {}

  async listEvents(): Promise<EventSchema[]> {
    const events = await this.prisma.event.findMany({
      include: {
        template: { select: { type: true } },
        room: { select: { name: true } },
        _count: { select: { registrations: true } }
      },
      orderBy: { startDate: 'desc' }
    });

    return events as EventSchema[];
  }

  async getEventById(id: string): Promise<EventSchema | null> {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: {
        template: { select: { type: true } },
        room: { select: { name: true } },
        _count: { select: { registrations: true } }
      }
    });

    return event ? (event as EventSchema) : null;
  }
}
