import { getTranslations } from 'next-intl/server';
import { listUsersForManagement } from '@repo/application';
import Typography from '@mui/material/Typography';
import Section from '@repo/ui/section';
import SectionSubtitle from '@repo/ui/section-subtitle';
import SectionTitle from '@repo/ui/section-title';
import AdminUsersTable from './admin-users-table';

export default async function AdminUsersPage() {
  const t = await getTranslations('pages.hub.admin.users');
  const users = await listUsersForManagement();
  const labels = {
    title: t('title'),
    subtitle: t('subtitle'),
    intro: t('intro'),
    columns: {
      firstName: t('columns.firstName'),
      lastName: t('columns.lastName'),
      username: t('columns.username'),
      email: t('columns.email'),
      profile: t('columns.profile'),
      admin: t('columns.admin'),
      machines: t('columns.machines'),
      events: t('columns.events'),
      openBadges: t('columns.openBadges')
    },
    adminStatus: {
      none: t('adminStatus.none'),
      global: t('adminStatus.global'),
      pedagogical: t('adminStatus.pedagogical')
    }
  };

  const adminLabelFor = (user: (typeof users)[number]) => {
    if (user.globalAdmin) {
      return labels.adminStatus.global;
    }
    if (user.pedagogicalAdmin) {
      return labels.adminStatus.pedagogical;
    }
    return labels.adminStatus.none;
  };

  return (
    <>
      <SectionTitle>{labels.title}</SectionTitle>
      <Section>
        <SectionSubtitle>{labels.subtitle}</SectionSubtitle>
        <Typography variant="body1">{labels.intro}</Typography>
      </Section>

      <Section>
        <AdminUsersTable users={users} columns={labels.columns} adminLabelFor={adminLabelFor} />
      </Section>
    </>
  );
}
