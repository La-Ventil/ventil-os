import type { JSX } from 'react';
import { getTranslations } from 'next-intl/server';
import { canAssignOpenBadgeUser, getOpenBadgeById, listUsersForManagement } from '@repo/application';
import OpenBadgeModalRouteClient from '../../../open-badge-modal-route.client';
import { isOpenBadgeTab } from '../../layout';
import { getServerSession } from '../../../../../../lib/auth';

type OpenBadgeModalPageProps = {
  params: Promise<{ tab: string; badgeId: string }>;
};

export default async function OpenBadgeModalPage({ params }: OpenBadgeModalPageProps): Promise<JSX.Element | null> {
  const { tab, badgeId } = await params;

  if (!isOpenBadgeTab(tab)) {
    return null;
  }

  const session = await getServerSession();
  const openBadge = await getOpenBadgeById(badgeId);
  if (!openBadge) {
    return null;
  }

  const canAssign = await canAssignOpenBadgeUser(badgeId, session?.user);
  const users = canAssign ? await listUsersForManagement() : [];
  const userOptions = canAssign
    ? users.map((entry) => ({
        id: entry.id,
        label: `${entry.firstName} ${entry.lastName ?? ''}`.trim()
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
