import type { JSX } from 'react';
import { getTranslations } from 'next-intl/server';
import Typography from '@mui/material/Typography';
import { OpenBadgeRepositoryMock } from '@repo/db/mocks';
import { OpenBadgeIcon } from '@repo/ui/icons/open-badge-icon';
import OpenBadgeCard from '@repo/ui/open-badge-card';
import Section from '@repo/ui/section';
import SectionSubtitle from '@repo/ui/section-subtitle';
import SectionTitle from '@repo/ui/section-title';
import OpenBadgeModalRoute from './open-badge-modal-route';
import ServerTabs from '@repo/ui/server-tabs';

const openBadgeRepository = new OpenBadgeRepositoryMock();
const defaultTab = 'all';
const tabsBaseId = 'open-badge-tabs';

type OpenBadgePageProps = {
  searchParams?: Promise<{
    tab?: string;
    badgeId?: string;
  }>;
};

export default async function Page({
  searchParams
}: OpenBadgePageProps): Promise<JSX.Element> {
  const resolvedSearchParams = await searchParams;
  const t = await getTranslations('pages.hub.openBadges');
  const badges = await openBadgeRepository.listOpenBadges();
  const myBadges = badges.filter((badge) => badge.activeLevel > 0);
  const tab = resolvedSearchParams?.tab === 'mine' ? 'mine' : defaultTab;
  const badgeId = resolvedSearchParams?.badgeId;
  const selectedBadge = badgeId ? badges.find((badge) => badge.id === badgeId) ?? null : null;
  const tabHref = `?${new URLSearchParams({ tab }).toString()}`;
  const allTabId = `${tabsBaseId}-tab-all`;
  const mineTabId = `${tabsBaseId}-tab-mine`;
  const allPanelId = `${tabsBaseId}-panel-all`;
  const minePanelId = `${tabsBaseId}-panel-mine`;

  return (
    <>
      <SectionTitle icon={<OpenBadgeIcon color="secondary" />}>{t('title')}</SectionTitle>
      <Section>
        <SectionSubtitle>{t('subtitle')}</SectionSubtitle>
        <Typography variant="body1">{t('intro')}</Typography>
      </Section>

      <ServerTabs
        ariaLabel={t('tabs.ariaLabel')}
        activeValue={tab}
        baseId={tabsBaseId}
        tabs={[
          { value: 'all', label: t('tabs.all'), href: '?tab=all', controlsId: allPanelId },
          { value: 'mine', label: t('tabs.mine'), href: '?tab=mine', controlsId: minePanelId }
        ]}
      />

      <Section
        id={allPanelId}
        role="tabpanel"
        aria-labelledby={allTabId}
        hidden={tab !== 'all'}
      >
        {badges.map((badge) => (
          <OpenBadgeCard
            key={badge.id}
            badge={badge}
            href={`?${new URLSearchParams({ tab, badgeId: badge.id }).toString()}`}
          />
        ))}
      </Section>
      <Section
        id={minePanelId}
        role="tabpanel"
        aria-labelledby={mineTabId}
        hidden={tab !== 'mine'}
      >
        {myBadges.map((badge) => (
          <OpenBadgeCard
            key={badge.id}
            badge={badge}
            href={`?${new URLSearchParams({ tab, badgeId: badge.id }).toString()}`}
          />
        ))}
      </Section>

      <OpenBadgeModalRoute openBadge={selectedBadge} closeHref={tabHref} />
    </>
  );
}
