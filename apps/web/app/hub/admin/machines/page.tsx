import { getTranslations } from 'next-intl/server';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import { canManageBadges } from '@repo/application';
import { browseMachinesAsAdmin } from '@repo/application/machines/usecases';
import AdminButton from '@repo/ui/admin/admin-button';
import AdminActionsSection from '@repo/ui/admin/admin-actions-section';
import AdminMachinesTable from '@repo/ui/admin/admin-machines-table';
import Section from '@repo/ui/section';
import SectionSubtitle from '@repo/ui/section-subtitle';
import SectionTitle from '@repo/ui/section-title';
import { MachineAdminStatus } from '@repo/view-models/machine-admin';
import MachineQuickActions from './machine-quick-actions';
import { getServerSession } from '../../../../lib/auth';
import { redirect } from 'next/navigation';

export default async function AdminMachinesPage() {
  const session = await getServerSession();
  const userCanManageBadges = canManageBadges(session?.user);

  if (!session || !userCanManageBadges) {
    redirect('/hub/profile');
  }

  const t = await getTranslations('pages.hub.admin.machines');
  const machines = await browseMachinesAsAdmin();

  const labels = {
    title: t('title'),
    subtitle: t('subtitle'),
    intro: t('intro'),
    actions: {
      create: t('actions.create'),
      manage: t('actions.manage'),
      edit: t('actions.edit'),
      activate: t('actions.activate'),
      deactivate: t('actions.deactivate')
    },
    columns: {
      actions: t('columns.actions'),
      image: t('columns.image'),
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
    machine.status === MachineAdminStatus.Active ? labels.status.active : labels.status.inactive;

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
          renderActions={(machine) => <MachineQuickActions machine={machine} labels={labels.actions} />}
        />
      </Section>
    </>
  );
}
