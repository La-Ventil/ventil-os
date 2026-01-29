import type { JSX } from 'react';
import { getTranslations } from 'next-intl/server';
import { listAdminUsers, listOpenBadges } from '@repo/application';
import AssignOpenBadgeModalRoute from '../../assign-open-badge-modal-route';

type AdminUsersModalPageProps = {
  params: Promise<{ userId: string }>;
};

export default async function AdminUsersModalPage({
  params
}: AdminUsersModalPageProps): Promise<JSX.Element | null> {
  const { userId } = await params;
  const t = await getTranslations('pages.hub.admin.users');
  const users = await listAdminUsers();
  const openBadges = await listOpenBadges();
  const user = users.find((entry) => entry.id === userId) ?? null;

  if (!user) {
    return null;
  }

  const userOptions = users.map((entry) => ({
    id: entry.id,
    label: `${entry.firstName} ${entry.lastName ?? ''}`.trim()
  }));

  return (
    <AssignOpenBadgeModalRoute
      user={user}
      users={userOptions}
      openBadges={openBadges}
      labels={{
        title: t('assignModal.title'),
        subtitle: t('assignModal.subtitle'),
        badgeLabel: t('assignModal.badgeLabel'),
        levelLabel: t('assignModal.levelLabel'),
        userLabel: t('assignModal.userLabel'),
        cancel: t('assignModal.cancel'),
        confirm: t('assignModal.confirm'),
        illustrationPlaceholder: t('assignModal.illustrationPlaceholder'),
        error: t('assignModal.error')
      }}
      closeHref="/hub/admin/users"
    />
  );
}
