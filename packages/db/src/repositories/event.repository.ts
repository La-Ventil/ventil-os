import type { PrismaClient } from '@prisma/client';
import { eventInclude } from '../selects/event';
import type { EventReadModel } from '../read-models/event';

export class EventRepository {
  constructor(private prisma: PrismaClient) {}

  async listEvents(): Promise<EventReadModel[]> {
    const events = await this.prisma.event.findMany({
      include: eventInclude,
      orderBy: { startDate: 'desc' }
    });

    return events as EventReadModel[];
  }

  async getEventById(id: string): Promise<EventReadModel | null> {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: eventInclude
    });

    return event ? (event as EventReadModel) : null;
  }
}
