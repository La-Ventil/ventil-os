import type { JSX } from 'react';
import { viewOpenBadgeAssignContext } from '@repo/application/open-badges/usecases';
import AssignOpenBadgeModalRoute from '../../assign-open-badge-modal-route';

type AdminOpenBadgesModalPageProps = {
  params: Promise<{ badgeId: string }>;
};

export default async function AdminOpenBadgesModalPage({
  params
}: AdminOpenBadgesModalPageProps): Promise<JSX.Element | null> {
  const { badgeId } = await params;
  const context = await viewOpenBadgeAssignContext(badgeId);
  if (!context) {
    return null;
  }

  return (
    <AssignOpenBadgeModalRoute
      openBadge={context.openBadge}
      users={context.users}
      userIdsByOpenBadgeIdAndLevel={context.userIdsByOpenBadgeIdAndLevel}
      closeHref="/hub/admin/open-badges"
    />
  );
}
