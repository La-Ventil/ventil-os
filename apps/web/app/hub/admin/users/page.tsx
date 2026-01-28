import { getTranslations } from 'next-intl/server';
import { listAdminUsers, listOpenBadges } from '@repo/application';
import AdminUsersClient from './users-client';

export default async function AdminUsersPage() {
  const t = await getTranslations('pages.hub.admin.users');
  const users = await listAdminUsers();
  const openBadges = await listOpenBadges();

  return (
    <AdminUsersClient
      users={users}
      openBadges={openBadges}
      labels={{
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
          openBadges: t('columns.openBadges'),
          assign: t('columns.assign')
        },
        adminStatus: {
          none: t('adminStatus.none'),
          global: t('adminStatus.global'),
          pedagogical: t('adminStatus.pedagogical')
        },
        assignModal: {
          title: t('assignModal.title'),
          subtitle: t('assignModal.subtitle'),
          badgeLabel: t('assignModal.badgeLabel'),
          levelLabel: t('assignModal.levelLabel'),
          userLabel: t('assignModal.userLabel'),
          cancel: t('assignModal.cancel'),
          confirm: t('assignModal.confirm'),
          illustrationPlaceholder: t('assignModal.illustrationPlaceholder')
        }
      }}
    />
  );
}
