import { eventRepository } from '@repo/db';
import type { EventViewModel } from '@repo/view-models/event';
import { mapEventToViewModel } from './mappers/event';

export const listEvents = async (): Promise<EventViewModel[]> => {
  const events = await eventRepository.listEvents();
  return events.map(mapEventToViewModel);
};

export const getEventById = async (id: string): Promise<EventViewModel | null> => {
  const event = await eventRepository.getEventById(id);
  return event ? mapEventToViewModel(event) : null;
};
