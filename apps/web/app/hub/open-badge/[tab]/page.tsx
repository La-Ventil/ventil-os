import type { JSX } from 'react';
import { notFound, redirect } from 'next/navigation';
import { listOpenBadges, listOpenBadgesForUser } from '@repo/application';
import OpenBadgeList from '@repo/ui/open-badge-list';
import { getServerSession } from '../../../../lib/auth';
import { isOpenBadgeTab, type OpenBadgeTab } from './layout';

type OpenBadgeTabPageProps = {
  params: Promise<{ tab: string }>;
};

export default async function OpenBadgeTabPage({ params }: OpenBadgeTabPageProps): Promise<JSX.Element> {
  const { tab: rawTab } = await params;

  if (!isOpenBadgeTab(rawTab)) {
    notFound();
  }

  const tab: OpenBadgeTab = rawTab;
  const badges = tab === 'mine' ? await listUserBadges() : await listOpenBadges();

  return <OpenBadgeList badges={badges} getBadgeHref={(badgeId) => `/hub/open-badge/${tab}/${badgeId}`} />;
}

async function listUserBadges() {
  const session = await getServerSession();
  if (!session?.user?.id) {
    redirect('/login');
  }

  return listOpenBadgesForUser(session.user.id);
}
