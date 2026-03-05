import type { JSX } from 'react';
import { redirect } from 'next/navigation';
import { canManageBadges } from '@repo/application';
import { viewOpenBadgeAssignContext } from '@repo/application/open-badges/usecases';
import AssignOpenBadgeModalRoute from '../../assign-open-badge-modal-route';
import { getServerSession } from '../../../../../../lib/auth';

type AdminOpenBadgesModalPageProps = {
  params: Promise<{ badgeId: string }>;
};

export default async function AdminOpenBadgesModalPage({
  params
}: AdminOpenBadgesModalPageProps): Promise<JSX.Element | null> {
  const session = await getServerSession();
  const currentUser = session?.user;
  const canManage = canManageBadges(currentUser);

  if (!session || !canManage) {
    redirect('/hub/profile');
  }

  const { badgeId } = await params;
  const context = await viewOpenBadgeAssignContext(badgeId, currentUser);
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
