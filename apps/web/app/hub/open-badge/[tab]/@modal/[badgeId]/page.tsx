import type { JSX } from 'react';
import { OpenBadgeRepositoryMock } from '@repo/application/mocks';
import OpenBadgeModalRoute from '@repo/ui/open-badge-modal-route';
import { isOpenBadgeTab } from '../../layout';

const openBadgeRepository = new OpenBadgeRepositoryMock();

type OpenBadgeModalPageProps = {
  params: Promise<{ tab: string; badgeId: string }>;
};

export default async function OpenBadgeModalPage({
  params
}: OpenBadgeModalPageProps): Promise<JSX.Element | null> {
  const { tab, badgeId } = await params;

  if (!isOpenBadgeTab(tab)) {
    return null;
  }

  const openBadge = await openBadgeRepository.getOpenBadgeById(badgeId);
  if (!openBadge) {
    return null;
  }

  return <OpenBadgeModalRoute openBadge={openBadge} closeHref={`/hub/open-badge/${tab}`} />;
}
