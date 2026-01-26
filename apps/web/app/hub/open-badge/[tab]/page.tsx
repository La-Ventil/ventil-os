import type { JSX } from 'react';
import { notFound, redirect } from 'next/navigation';
import { OpenBadgeRepositoryMock } from '@repo/application/mocks';
import OpenBadgeList from '@repo/ui/open-badge-list';
import { getServerSession } from '../../../../lib/auth';
import { isOpenBadgeTab, type OpenBadgeTab } from './layout';

type OpenBadgeTabPageProps = {
  params: Promise<{ tab: string }>;
};

export default async function OpenBadgeTabPage({
  params
}: OpenBadgeTabPageProps): Promise<JSX.Element> {
  const { tab: rawTab } = await params;

  if (!isOpenBadgeTab(rawTab)) {
    notFound();
  }

  const tab: OpenBadgeTab = rawTab;
  const badges =
    tab === 'mine'
      ? await listUserBadges()
      : await openBadgeRepository.listOpenBadges();

  return (
    <OpenBadgeList
      badges={badges}
      getBadgeHref={(badgeId) => `/hub/open-badge/${tab}/${badgeId}`}
    />
  );
}

const openBadgeRepository = new OpenBadgeRepositoryMock();

async function listUserBadges() {
  const session = await getServerSession();
  if (!session?.user?.id) {
    redirect('/login');
  }

  return openBadgeRepository.listOpenBadgesForUser(session.user.id);
}
