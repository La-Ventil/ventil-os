import { getTranslations } from 'next-intl/server';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import { listAdminOpenBadges } from '@repo/application';
import Section from '@repo/ui/section';
import SectionSubtitle from '@repo/ui/section-subtitle';
import SectionTitle from '@repo/ui/section-title';
import AdminOpenBadgesTable from './admin-open-badges-table';

export default async function AdminOpenBadgesPage() {
  const t = await getTranslations('pages.hub.admin.openBadges');
  const badges = await listAdminOpenBadges();

  const labels = {
    title: t('title'),
    subtitle: t('subtitle'),
    intro: t('intro'),
    actions: {
      create: t('actions.create')
    },
    columns: {
      name: t('columns.name'),
      levels: t('columns.levels'),
      assigned: t('columns.assigned'),
      status: t('columns.status')
    },
    status: {
      active: t('status.active'),
      inactive: t('status.inactive')
    }
  };

  const statusLabelFor = (badge: (typeof badges)[number]) =>
    badge.status === 'active' ? labels.status.active : labels.status.inactive;

  return (
    <>
      <SectionTitle>{labels.title}</SectionTitle>
      <Section>
        <SectionSubtitle>{labels.subtitle}</SectionSubtitle>
        <Typography variant="body1">{labels.intro}</Typography>
      </Section>

      <Section pt={0} pb={2} direction="row" justifyContent="flex-start">
        <Button variant="contained" component={Link} href="/hub/admin/open-badges/create">
          {labels.actions.create}
        </Button>
      </Section>

      <Section pt={0}>
        <AdminOpenBadgesTable
          badges={badges}
          columns={labels.columns}
          statusLabelFor={statusLabelFor}
        />
      </Section>
    </>
  );
}
