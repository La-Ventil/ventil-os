import type { JSX } from 'react';
import { browseAssignableUsersForOpenBadge, viewOpenBadge } from '@repo/application/open-badges/usecases';
import AssignOpenBadgeModalRoute from '../../assign-open-badge-modal-route';

type AdminOpenBadgesModalPageProps = {
  params: Promise<{ badgeId: string }>;
};

export default async function AdminOpenBadgesModalPage({
  params
}: AdminOpenBadgesModalPageProps): Promise<JSX.Element | null> {
  const { badgeId } = await params;
  const openBadge = await viewOpenBadge(badgeId);
  if (!openBadge) {
    return null;
  }

  const users = await browseAssignableUsersForOpenBadge(badgeId);
  const userOptions = users.map((entry) => ({
    id: entry.id,
    label: entry.fullName
  }));

  return <AssignOpenBadgeModalRoute openBadge={openBadge} users={userOptions} closeHref="/hub/admin/open-badges" />;
}
