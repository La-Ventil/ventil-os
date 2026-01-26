import type { EventSchema } from '@repo/db/schemas';
import type { EventViewModel } from '@repo/view-models/event';

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
