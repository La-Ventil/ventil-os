import { getTranslations } from 'next-intl/server';
import { browseUsersAsAdmin } from '@repo/application/users/usecases';
import Typography from '@mui/material/Typography';
import Section from '@repo/ui/section';
import SectionSubtitle from '@repo/ui/section-subtitle';
import SectionTitle from '@repo/ui/section-title';
import AdminUsersTable from './admin-users-table';

export default async function AdminUsersPage() {
  const t = await getTranslations('pages.hub.admin.users');
  const users = await browseUsersAsAdmin();
  const labels = {
    title: t('title'),
    subtitle: t('subtitle'),
    intro: t('intro'),
    columns: {
      actions: t('columns.actions'),
      avatar: t('columns.avatar'),
      firstName: t('columns.firstName'),
      lastName: t('columns.lastName'),
      username: t('columns.username'),
      email: t('columns.email'),
      profile: t('columns.profile'),
      admin: t('columns.admin'),
      status: t('columns.status'),
      machines: t('columns.machines'),
      events: t('columns.events'),
      openBadgesEarned: t('columns.openBadgesEarned'),
      openBadgesAssigned: t('columns.openBadgesAssigned')
    },
    actions: {
      manage: t('actions.manage'),
      edit: t('actions.edit'),
      block: t('actions.block'),
      unblock: t('actions.unblock')
    },
    adminStatus: {
      none: t('adminStatus.none'),
      global: t('adminStatus.global'),
      pedagogical: t('adminStatus.pedagogical')
    },
    status: {
      active: t('status.active'),
      blocked: t('status.blocked')
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
  const statusLabelFor = (user: (typeof users)[number]) =>
    user.blocked ? labels.status.blocked : labels.status.active;

  return (
    <>
      <SectionTitle>{labels.title}</SectionTitle>
      <Section>
        <SectionSubtitle>{labels.subtitle}</SectionSubtitle>
        <Typography variant="body1">{labels.intro}</Typography>
      </Section>

      <Section>
        <AdminUsersTable
          users={users}
          columns={labels.columns}
          adminLabelFor={adminLabelFor}
          statusLabelFor={statusLabelFor}
          actionLabels={labels.actions}
        />
      </Section>
    </>
  );
}
