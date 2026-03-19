import { eventRepository } from '@repo/db';
import type { EventViewModel } from '@repo/application/events/models/event';

import { mapEventToViewModel } from '../../presenters/event';

export const getEventById = async (id: string): Promise<EventViewModel | null> => {
  const event = await eventRepository.getEventById(id);
  return event ? mapEventToViewModel(event) : null;
};
