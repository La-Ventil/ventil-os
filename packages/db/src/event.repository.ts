import type { PrismaClient } from '@prisma/client';
import type { EventViewModel } from '@repo/domain/view-models/event';
import { mapEventToViewModel, type EventSchema } from './mappers/event';

export class EventRepository {
  constructor(private prisma: PrismaClient) {}

  async listEvents(): Promise<EventViewModel[]> {
    const events = await this.prisma.event.findMany({
      include: {
        template: { select: { type: true } },
        room: { select: { name: true } },
        _count: { select: { registrations: true } }
      },
      orderBy: { startDate: 'desc' }
    });

    return events.map((event) => mapEventToViewModel(event as EventSchema));
  }

  async getEventById(id: string): Promise<EventViewModel | null> {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: {
        template: { select: { type: true } },
        room: { select: { name: true } },
        _count: { select: { registrations: true } }
      }
    });

    return event ? mapEventToViewModel(event as EventSchema) : null;
  }
}
