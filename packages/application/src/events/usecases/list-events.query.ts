import { eventRepository } from '@repo/db';
import type { EventViewModel } from '@repo/application/events/models/event';

import { mapEventToViewModel } from '../../presenters/event';

export const listEvents = async (): Promise<EventViewModel[]> => {
  const events = await eventRepository.listEvents();
  return events.map(mapEventToViewModel);
};
