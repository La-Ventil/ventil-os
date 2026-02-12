import type { JSX } from 'react';
import { listMachineReservationsForUser, listMachines } from '@repo/application';
import { getTranslations } from 'next-intl/server';
import Typography from '@mui/material/Typography';
import Section from '@repo/ui/section';
import SectionSubtitle from '@repo/ui/section-subtitle';
import SectionTitle from '@repo/ui/section-title';
import { MachineIcon } from '@repo/ui/icons/machine-icon';
import MachineTabs from '@repo/ui/machine-tabs';
import { getServerSession } from '../../../lib/auth';
import styles from './page.module.css';

export default async function Page(): Promise<JSX.Element> {
  const t = await getTranslations('pages.hub.fabLab');
  const session = await getServerSession();
  const machines = await listMachines();
  const reservations = session?.user?.id ? await listMachineReservationsForUser(session.user.id) : [];
  return (
    <>
      <SectionTitle icon={<MachineIcon color="secondary" />}>{t('title')}</SectionTitle>
      <Section className={styles.root}>
        <SectionSubtitle>{t('subtitle')}</SectionSubtitle>
        <Typography variant="body1">{t('intro')}</Typography>
      </Section>
      <MachineTabs machines={machines} reservations={reservations} machineHrefBase="/hub/fab-lab" />
    </>
  );
}
