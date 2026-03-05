import type { JSX } from 'react';
import {
  browseAssignableUsersForOpenBadge,
  buildOpenBadgeAssignableUsersByBadgeIdAndLevel,
  viewOpenBadge
} from '@repo/application/open-badges/usecases';
import AssignOpenBadgeModalRoute from '../../assign-open-badge-modal-route';

type AdminOpenBadgesModalPageProps = {
  params: Promise<{ badgeId: string }>;
};

export default async function AdminOpenBadgesModalPage({
  params
}: AdminOpenBadgesModalPageProps): Promise<JSX.Element | null> {
  const { badgeId } = await params;
  const [openBadge, users] = await Promise.all([viewOpenBadge(badgeId), browseAssignableUsersForOpenBadge(badgeId)]);
  if (!openBadge) {
    return null;
  }

  const userIdsByOpenBadgeIdAndLevel = await buildOpenBadgeAssignableUsersByBadgeIdAndLevel([openBadge], users);

  return (
    <AssignOpenBadgeModalRoute
      openBadge={openBadge}
      users={users}
      userIdsByOpenBadgeIdAndLevel={userIdsByOpenBadgeIdAndLevel}
      closeHref="/hub/admin/open-badges"
    />
  );
}
