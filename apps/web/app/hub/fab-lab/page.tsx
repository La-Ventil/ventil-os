import type { JSX } from 'react';
import { listMachines } from '@repo/application';
import { getTranslations } from 'next-intl/server';
import Typography from '@mui/material/Typography';
import Section from '@repo/ui/section';
import SectionSubtitle from '@repo/ui/section-subtitle';
import SectionTitle from '@repo/ui/section-title';
import { MachineIcon } from '@repo/ui/icons/machine-icon';
import MachineTabs from '@repo/ui/machine-tabs';
import styles from './page.module.css';

export default async function Page(): Promise<JSX.Element> {
  const t = await getTranslations('pages.hub.fabLab');
  const machines = await listMachines();
  return (
    <>
      <SectionTitle icon={<MachineIcon color="secondary" />}>{t('title')}</SectionTitle>
      <Section className={styles.root}>
        <SectionSubtitle>{t('subtitle')}</SectionSubtitle>
        <Typography variant="body1">{t('intro')}</Typography>
      </Section>
      <MachineTabs machines={machines} />
    </>
  );
}
