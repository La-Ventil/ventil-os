import type { JSX } from 'react';
import { notFound, redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { browseOpenBadges, viewUserOpenBadges } from '@repo/application';
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
  const t = await getTranslations('pages.hub.openBadges');
  const session = await getServerSession();
  const badges =
    tab === 'mine'
      ? await listUserBadges(session?.user?.id)
      : await browseOpenBadges(session?.user?.id);

  const emptyMessage = tab === 'mine' ? t('empty.mine') : t('empty.all');

  return (
    <OpenBadgeList
      badges={badges}
      getBadgeHref={(badgeId) => `/hub/open-badge/${tab}/${badgeId}`}
      emptyMessage={emptyMessage}
    />
  );
}

async function listUserBadges(userId?: string) {
  if (!userId) {
    redirect('/login');
  }

  return viewUserOpenBadges(userId);
}
