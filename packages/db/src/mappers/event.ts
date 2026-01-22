import type { Prisma } from '@prisma/client';
import type { EventViewModel } from '@repo/domain/view-models/event';

export type EventSchema = Prisma.EventGetPayload<{
  include: {
    template: {
      select: {
        type: true;
      };
    };
    room: {
      select: {
        name: true;
      };
    };
    _count: {
      select: {
        registrations: true;
      };
    };
  };
}>;

export const mapEventToViewModel = (event: EventSchema): EventViewModel => {
  const registrationCount = event._count.registrations;
  const capacity = event.maxParticipants ?? 0;
  const location = event.room.name;
  const type = event.template.type;
  const startDate = event.startDate.toISOString();

  return {
    id: event.id,
    type,
    name: event.name,
    startDate,
    location,
    audience: event.audience,
    registration: {
      current: registrationCount,
      capacity
    },
    description: event.description
  };
};
