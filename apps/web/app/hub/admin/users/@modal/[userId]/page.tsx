import type { JSX } from 'react';
import { listOpenBadges, listUsersForManagement } from '@repo/application';
import AssignOpenBadgeModalRoute from '../../assign-open-badge-modal-route';

type AdminUsersModalPageProps = {
  params: Promise<{ userId: string }>;
};

export default async function AdminUsersModalPage({
  params
}: AdminUsersModalPageProps): Promise<JSX.Element | null> {
  const { userId } = await params;
  const users = await listUsersForManagement();
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
      translationNamespace="pages.hub.admin.users.assignModal"
      closeHref="/hub/admin/users"
    />
  );
}
