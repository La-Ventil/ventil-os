'use client';

import type { JSX } from 'react';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import type { MachineViewModel } from '@repo/view-models/machine';
import CardList from '@repo/ui/card-list';
import MachineCard from '@repo/ui/machine-card';
import Section from '@repo/ui/section';
import SectionSubtitle from '@repo/ui/section-subtitle';
import SectionTitle from '@repo/ui/section-title';
import { MachineIcon } from '@repo/ui/icons/machine-icon';
import styles from './page.module.css';

export type FabLabClientProps = {
  machines: MachineViewModel[];
};

export default function FabLabClient({ machines }: FabLabClientProps): JSX.Element {
  const t = useTranslations('pages.hub.fabLab');
  const [tabValue, setTabValue] = useState(0);

  return (
    <>
      <SectionTitle icon={<MachineIcon color="secondary" />}>{t('title')}</SectionTitle>
      <Section className={styles.root}>
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

      <CardList component="section">
        {machines.map((machine) => (
          <MachineCard key={machine.id} machine={machine} t={t} />
        ))}
      </CardList>
    </>
  );
}
