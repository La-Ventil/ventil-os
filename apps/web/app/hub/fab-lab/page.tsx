'use client';

import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { MachineAvailability, type Machine } from '@repo/domain/machine';
import MachineCard from '@repo/ui/machine-card';
import { MachineIcon } from '@repo/ui/icons/machine-icon';
import Section from '@repo/ui/section';
import SectionSubtitle from '@repo/ui/section-subtitle';
import SectionTitle from '@repo/ui/section-title';
import styles from './page.module.css';

export default function Page() {
  const t = useTranslations('pages.hub.fabLab');
  const [tabValue, setTabValue] = useState(0);

  const machines: Machine[] = [
    {
      id: 'machine-1',
      category: t('card.category'),
      title: t('card.title'),
      description: t('card.description'),
      availability: MachineAvailability.Available,
      illustrationLabel: t('card.illustrationPlaceholder')
    },
    {
      id: 'machine-2',
      category: t('card.category'),
      title: t('card.title'),
      description: t('card.description'),
      availability: MachineAvailability.Reserved,
      illustrationLabel: t('card.illustrationPlaceholder')
    },
    {
      id: 'machine-3',
      category: t('card.category'),
      title: t('card.title'),
      description: t('card.description'),
      availability: MachineAvailability.Occupied,
      illustrationLabel: t('card.illustrationPlaceholder')
    }
  ];

  return (
    <>
      <Section className={styles.root}>
        <SectionTitle icon={<MachineIcon />}>{t('title')}</SectionTitle>
        <SectionSubtitle>{t('subtitle')}</SectionSubtitle>
        <Typography variant="body1">{t('intro')}</Typography>
      </Section>

      <Tabs
        value={tabValue}
        onChange={(_, value) => setTabValue(value)}
        variant="fullWidth"
        aria-label={t('tabs.ariaLabel')}
      >
        <Tab label={t('tabs.available')} />
        <Tab label={t('tabs.reservations')} />
      </Tabs>

      <Section>
          {machines.map((machine) => (
            <MachineCard key={machine.id} machine={machine} t={t} />
          ))}
      </Section>
    </>
  );
}
