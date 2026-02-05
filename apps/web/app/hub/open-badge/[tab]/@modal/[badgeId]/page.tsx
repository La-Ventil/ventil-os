import type { JSX } from 'react';
import { getOpenBadgeById } from '@repo/application';
import OpenBadgeModalRoute from '@repo/ui/open-badge/open-badge-modal-route';
import { isOpenBadgeTab } from '../../layout';

type OpenBadgeModalPageProps = {
  params: Promise<{ tab: string; badgeId: string }>;
};

export default async function OpenBadgeModalPage({ params }: OpenBadgeModalPageProps): Promise<JSX.Element | null> {
  const { tab, badgeId } = await params;

  if (!isOpenBadgeTab(tab)) {
    return null;
  }

  const openBadge = await getOpenBadgeById(badgeId);
  if (!openBadge) {
    return null;
  }

  return <OpenBadgeModalRoute openBadge={openBadge} closeHref={`/hub/open-badge/${tab}`} />;
}
