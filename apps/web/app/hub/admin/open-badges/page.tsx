import { getTranslations } from 'next-intl/server';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import { canManageBadges } from '@repo/application';
import { browseOpenBadgesAsAdmin } from '@repo/application/open-badges/usecases';
import AdminButton from '@repo/ui/admin/admin-button';
import AdminActionsSection from '@repo/ui/admin/admin-actions-section';
import Section from '@repo/ui/section';
import SectionSubtitle from '@repo/ui/section-subtitle';
import SectionTitle from '@repo/ui/section-title';
import { OpenBadgeAdminStatus } from '@repo/view-models/open-badge-admin';
import AdminOpenBadgesTable from './admin-open-badges-table';
import { getServerSession } from '../../../../lib/auth';
import { redirect } from 'next/navigation';

export default async function AdminOpenBadgesPage() {
  const session = await getServerSession();
  const userCanManageBadges = canManageBadges(session?.user);

  if (!session || !userCanManageBadges) {
    redirect('/hub/profile');
  }

  const t = await getTranslations('pages.hub.admin.openBadges');
  const badges = await browseOpenBadgesAsAdmin();

  const labels = {
    title: t('title'),
    subtitle: t('subtitle'),
    intro: t('intro'),
    actions: {
      create: t('actions.create'),
      manage: t('actions.manage'),
      edit: t('actions.edit'),
      activate: t('actions.activate'),
      deactivate: t('actions.deactivate'),
      remove: t('actions.delete')
    },
    columns: {
      image: t('columns.image'),
      name: t('columns.name'),
      levels: t('columns.levels'),
      assigned: t('columns.assigned'),
      status: t('columns.status'),
      actions: t('columns.actions'),
      assign: t('columns.assign')
    },
    status: {
      active: t('status.active'),
      inactive: t('status.inactive')
    }
  };

  const statusLabelFor = (badge: (typeof badges)[number]) =>
    badge.status === OpenBadgeAdminStatus.Active ? labels.status.active : labels.status.inactive;

  return (
    <>
      <SectionTitle>{labels.title}</SectionTitle>
      <Section>
        <SectionSubtitle>{labels.subtitle}</SectionSubtitle>
        <Typography variant="body1">{labels.intro}</Typography>
      </Section>

      <AdminActionsSection>
        <Link href="/hub/admin/open-badges/create">
          <AdminButton variant="contained" component="span">
            {labels.actions.create}
          </AdminButton>
        </Link>
      </AdminActionsSection>

      <Section pt={0}>
        <AdminOpenBadgesTable
          badges={badges}
          columns={labels.columns}
          statusLabelFor={statusLabelFor}
          actionLabels={labels.actions}
        />
      </Section>
    </>
  );
}
