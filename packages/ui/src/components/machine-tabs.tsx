'use client';

import type { JSX } from 'react';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import type { MachineViewModel } from '@repo/view-models/machine';
import CardList from './card-list';
import MachineCard from './machine-card';

export type MachineTabsProps = {
  machines: MachineViewModel[];
  machineHrefBase?: string;
};

export default function MachineTabs({ machines, machineHrefBase }: MachineTabsProps): JSX.Element {
  const t = useTranslations('pages.hub.fabLab');
  const router = useRouter();
  const [tabValue, setTabValue] = useState(0);
  const handleMachineClick = (machineId: string) =>
    machineHrefBase
      ? () => {
          router.push(`${machineHrefBase}/${machineId}`);
        }
      : undefined;

  return (
    <>
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
          <MachineCard key={machine.id} machine={machine} t={t} onClick={handleMachineClick(machine.id)} />
        ))}
      </CardList>
    </>
  );
}
