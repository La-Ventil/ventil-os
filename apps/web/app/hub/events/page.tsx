'use client';
import type { JSX } from 'react';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import type { EventViewModel } from '@repo/view-models/event';
import { EventRepositoryMock } from '@repo/application/mocks';
import EventCard from '@repo/ui/event-card';
import { EventIcon } from '@repo/ui/icons/event-icon';
import Section from '@repo/ui/section';
import SectionSubtitle from '@repo/ui/section-subtitle';
import SectionTitle from '@repo/ui/section-title';
import CardList from '@repo/ui/card-list';

const eventRepository = new EventRepositoryMock();

export default function Page(): JSX.Element {
  const t = useTranslations('pages.hub.events');
  const [tabValue, setTabValue] = useState(0);
  const [events, setEvents] = useState<EventViewModel[]>([]);

  useEffect(() => {
    eventRepository.listEvents().then(setEvents);
  }, []);

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

      <CardList>
        {events.map((event) => (
          <EventCard key={event.id} event={event} t={t} />
        ))}
      </CardList>
    </>
  );
}
