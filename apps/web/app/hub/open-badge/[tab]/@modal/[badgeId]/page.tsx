import type { JSX } from 'react';
import {
  browseAssignableUsersForOpenBadge,
  buildOpenBadgeAssignableUsersByBadgeIdAndLevel,
  canAssignOpenBadge,
  viewOpenBadge
} from '@repo/application/open-badges/usecases';
import OpenBadgeModalRouteClient from '../../../open-badge-modal-route.client';
import { isOpenBadgeTab } from '../../layout';
import { getServerSession } from '../../../../../../lib/auth';

type OpenBadgeModalPageProps = {
  params: Promise<{ tab: string; badgeId: string }>;
};

export default async function OpenBadgeModalPage({ params }: OpenBadgeModalPageProps): Promise<JSX.Element | null> {
  const [{ tab, badgeId }, session] = await Promise.all([params, getServerSession()]);

  if (!isOpenBadgeTab(tab)) {
    return null;
  }

  const [openBadge, canAssign] = await Promise.all([
    viewOpenBadge(badgeId),
    canAssignOpenBadge(badgeId, session?.user)
  ]);
  if (!openBadge) {
    return null;
  }

  const users = canAssign ? await browseAssignableUsersForOpenBadge(badgeId) : [];
  const userIdsByOpenBadgeIdAndLevel = await buildOpenBadgeAssignableUsersByBadgeIdAndLevel([openBadge], users);

  return (
    <OpenBadgeModalRouteClient
      openBadge={openBadge}
      closeHref={`/hub/open-badge/${tab}`}
      canAssign={canAssign}
      users={users}
      userIdsByOpenBadgeIdAndLevel={userIdsByOpenBadgeIdAndLevel}
    />
  );
}
