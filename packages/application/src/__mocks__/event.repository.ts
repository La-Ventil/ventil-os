import type { EventViewModel } from '@repo/view-models/event';

const events: EventViewModel[] = [
  {
    id: 'event-1',
    type: "Type d'atelier",
    name: "Nom de l'atelier",
    startDate: '2026-11-16T16:00:00.000Z',
    location: 'Fab Lab',
    audience: 'Ouvert a tous',
    registration: { current: 2, capacity: 6 },
    description:
      'Vous voulez reparer vos manettes de consoles de jeux ? Venez apprendre en reparant au repair cafe.'
  },
  {
    id: 'event-2',
    type: "Type d'atelier",
    name: "Nom de l'atelier",
    startDate: '2026-11-16T16:00:00.000Z',
    location: 'Fab Lab',
    audience: 'Ouvert a tous',
    registration: { current: 2, capacity: 6 },
    description:
      'Vous voulez reparer vos manettes de consoles de jeux ? Venez apprendre en reparant au repair cafe.'
  }
];

export class EventRepositoryMock {
  async listEvents(): Promise<EventViewModel[]> {
    return events;
  }
}
