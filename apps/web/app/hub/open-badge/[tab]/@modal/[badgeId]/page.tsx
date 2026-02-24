import type { JSX } from 'react';
import { browseAssignableUsersForOpenBadge, canAssignOpenBadge, viewOpenBadge } from '@repo/application/open-badges/usecases';
import OpenBadgeModalRouteClient from '../../../open-badge-modal-route.client';
import { isOpenBadgeTab } from '../../layout';
import { getServerSession } from '../../../../../../lib/auth';
import type { UserSummaryViewModel } from '@repo/view-models/user-summary';

type OpenBadgeModalPageProps = {
  params: Promise<{ tab: string; badgeId: string }>;
};

export default async function OpenBadgeModalPage({ params }: OpenBadgeModalPageProps): Promise<JSX.Element | null> {
  const { tab, badgeId } = await params;

  if (!isOpenBadgeTab(tab)) {
    return null;
  }

  const session = await getServerSession();
  const openBadge = await viewOpenBadge(badgeId);
  if (!openBadge) {
    return null;
  }

  const canAssign = await canAssignOpenBadge(badgeId, session?.user);
  const users = canAssign ? await browseAssignableUsersForOpenBadge(badgeId) : [];
  const userOptions: UserSummaryViewModel[] = canAssign
    ? users.map((entry) => ({
        id: entry.id,
        firstName: entry.firstName,
        lastName: entry.lastName,
        username: entry.username,
        image: entry.image,
        email: entry.email,
        fullName: entry.fullName
      }))
    : [];

  return (
    <OpenBadgeModalRouteClient
      openBadge={openBadge}
      closeHref={`/hub/open-badge/${tab}`}
      canAssign={canAssign}
      users={userOptions}
    />
  );
}
