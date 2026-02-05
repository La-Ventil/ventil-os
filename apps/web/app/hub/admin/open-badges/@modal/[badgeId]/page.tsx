import type { JSX } from 'react';
import { getOpenBadgeById, listUsersForManagement } from '@repo/application';
import AssignOpenBadgeModalRoute from '../../assign-open-badge-modal-route';

type AdminOpenBadgesModalPageProps = {
  params: Promise<{ badgeId: string }>;
};

export default async function AdminOpenBadgesModalPage({
  params
}: AdminOpenBadgesModalPageProps): Promise<JSX.Element | null> {
  const { badgeId } = await params;
  const openBadge = await getOpenBadgeById(badgeId);
  if (!openBadge) {
    return null;
  }

  const users = await listUsersForManagement();
  const userOptions = users.map((entry) => ({
    id: entry.id,
    label: `${entry.firstName} ${entry.lastName ?? ''}`.trim()
  }));

  return <AssignOpenBadgeModalRoute openBadge={openBadge} users={userOptions} closeHref="/hub/admin/open-badges" />;
}
