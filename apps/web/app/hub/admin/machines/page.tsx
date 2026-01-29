import { getTranslations } from 'next-intl/server';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import { listAdminMachines } from '@repo/application';
import AdminButton from '@repo/ui/admin/admin-button';
import AdminActionsSection from '@repo/ui/admin/admin-actions-section';
import Section from '@repo/ui/section';
import SectionSubtitle from '@repo/ui/section-subtitle';
import SectionTitle from '@repo/ui/section-title';
import AdminMachinesTable from './admin-machines-table';

export default async function AdminMachinesPage() {
  const t = await getTranslations('pages.hub.admin.machines');
  const machines = await listAdminMachines();

  const labels = {
    title: t('title'),
    subtitle: t('subtitle'),
    intro: t('intro'),
    actions: {
      create: t('actions.create')
    },
    columns: {
      name: t('columns.name'),
      category: t('columns.category'),
      room: t('columns.room'),
      badgeRequirements: t('columns.badgeRequirements'),
      status: t('columns.status')
    },
    status: {
      active: t('status.active'),
      inactive: t('status.inactive')
    }
  };

  const statusLabelFor = (machine: (typeof machines)[number]) =>
    machine.status === 'active' ? labels.status.active : labels.status.inactive;

  return (
    <>
      <SectionTitle>{labels.title}</SectionTitle>
      <Section>
        <SectionSubtitle>{labels.subtitle}</SectionSubtitle>
        <Typography variant="body1">{labels.intro}</Typography>
      </Section>

      <AdminActionsSection>
        <Link href="/hub/admin/machines/create">
          <AdminButton variant="contained" component="span">
            {labels.actions.create}
          </AdminButton>
        </Link>
      </AdminActionsSection>

      <Section pt={0}>
        <AdminMachinesTable
          machines={machines}
          columns={labels.columns}
          statusLabelFor={statusLabelFor}
        />
      </Section>
    </>
  );
}
