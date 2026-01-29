import type { JSX } from 'react';
import { listEvents } from '@repo/application';
import EventsClient from './events-client';

export default async function Page(): Promise<JSX.Element> {
  const events = await listEvents();
  return <EventsClient events={events} />;
}
