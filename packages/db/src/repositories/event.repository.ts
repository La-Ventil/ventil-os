import type { PrismaClient } from '@prisma/client';
import { includeEventSchemaRaw, type EventSchema } from '../schemas/event';

export class EventRepository {
  constructor(private prisma: PrismaClient) {}

  async listEvents(): Promise<EventSchema[]> {
    const events = await this.prisma.event.findMany({
      include: includeEventSchemaRaw,
      orderBy: { startDate: 'desc' }
    });

    return events as EventSchema[];
  }

  async getEventById(id: string): Promise<EventSchema | null> {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: includeEventSchemaRaw
    });

    return event ? (event as EventSchema) : null;
  }
}
