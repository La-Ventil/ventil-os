'use client';
import type { JSX } from 'react';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import type { MachineViewModel } from '@repo/domain/view-models/machine';
import { MachineRepositoryMock } from '@repo/db/mocks';
import MachineCard from '@repo/ui/machine-card';
import { MachineIcon } from '@repo/ui/icons/machine-icon';
import Section from '@repo/ui/section';
import SectionSubtitle from '@repo/ui/section-subtitle';
import SectionTitle from '@repo/ui/section-title';
import styles from './page.module.css';

const machineRepository = new MachineRepositoryMock();

export default function Page(): JSX.Element {
  const t = useTranslations('pages.hub.fabLab');
  const [tabValue, setTabValue] = useState(0);
  const [machines, setMachines] = useState<MachineViewModel[]>([]);

  useEffect(() => {
    machineRepository.listMachines().then(setMachines);
  }, []);

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

      <Section>
        {machines.map((machine) => (
          <MachineCard key={machine.id} machine={machine} t={t} />
        ))}
      </Section>
    </>
  );
}
