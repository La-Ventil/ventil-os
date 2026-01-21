'use client';

import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import type { EventViewModel } from '@repo/domain/view-models/event';
import EventCard from '@repo/ui/event-card';
import { EventIcon } from '@repo/ui/icons/event-icon';
import Section from '@repo/ui/section';
import SectionSubtitle from '@repo/ui/section-subtitle';
import SectionTitle from '@repo/ui/section-title';

export default function Page() {
  const t = useTranslations('pages.hub.events');
  const [tabValue, setTabValue] = useState(0);

  const events: EventViewModel[] = [
    {
      id: 'event-1',
      type: 'Type d’atelier',
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
      type: 'Type d’atelier',
      name: "Nom de l'atelier",
      startDate: '2026-11-16T16:00:00.000Z',
      location: 'Fab Lab',
      audience: 'Ouvert a tous',
      registration: { current: 2, capacity: 6 },
      description:
        'Vous voulez reparer vos manettes de consoles de jeux ? Venez apprendre en reparant au repair cafe.'
    }
  ];

  return (
    <>
      <SectionTitle icon={<EventIcon color="secondary" />}>{t('title')}</SectionTitle>
      <Section>
        <SectionSubtitle>{t('subtitle')}</SectionSubtitle>
        <Typography variant="body1">{t('intro')}</Typography>
      </Section>

      <Tabs
        value={tabValue}
        onChange={(_, value) => setTabValue(value)}
        variant="fullWidth"
        aria-label={t('tabs.ariaLabel')}
      >
        <Tab label={t('tabs.upcoming')} />
        <Tab label={t('tabs.mine')} />
      </Tabs>

      <Section>
        {events.map((event) => (
          <EventCard key={event.id} event={event} t={t} />
        ))}
      </Section>
    </>
  );
}
