import type { JSX } from 'react';
import { getTranslations } from 'next-intl/server';
import Typography from '@mui/material/Typography';
import { OpenBadgeRepositoryMock } from '@repo/db/mocks';
import type { OpenBadgeViewModel } from '@repo/domain/view-models/open-badge';
import { OpenBadgeIcon } from '@repo/ui/icons/open-badge-icon';
import OpenBadgeCard from '@repo/ui/open-badge-card';
import Section from '@repo/ui/section';
import SectionSubtitle from '@repo/ui/section-subtitle';
import SectionTitle from '@repo/ui/section-title';
import OpenBadgeModalRoute from './open-badge-modal-route';
import ServerTabs, { buildServerTabsConfig } from '@repo/ui/server-tabs';

const openBadgeRepository = new OpenBadgeRepositoryMock();
const defaultTab = 'all';
const tabsBaseId = 'open-badge-tabs';
const openBadgeTabs = ['all', 'mine'] as const;

type OpenBadgePageProps = {
  searchParams?: Promise<{
    tab?: string;
    badgeId?: string;
  }>;
};

type OpenBadgeTab = (typeof openBadgeTabs)[number];
type TranslationFn = (key: string) => string;


const createTabSelector = <T extends string>(tabs: readonly T[], fallback: T) => {
  const allowed = new Set<T>(tabs);

  return (params?: { tab?: string }): T => {
    const tab = params?.tab;
    return tab && allowed.has(tab as T) ? (tab as T) : fallback;
  };
};

const getMyBadges = (badges: OpenBadgeViewModel[]) =>
  badges.filter((badge) => badge.activeLevel > 0);

const getSelectedBadge = (
  badges: OpenBadgeViewModel[],
  badgeId?: string
): OpenBadgeViewModel | null =>
  badgeId ? badges.find((badge) => badge.id === badgeId) ?? null : null;

export default async function Page({
  searchParams
}: OpenBadgePageProps): Promise<JSX.Element> {
  const resolvedSearchParams = await searchParams;
  const t = await getTranslations('pages.hub.openBadges');
  const badges = await openBadgeRepository.listOpenBadges();
  const tab = createTabSelector(openBadgeTabs, defaultTab)(resolvedSearchParams);
  const myBadges = getMyBadges(badges);
  const selectedBadge = getSelectedBadge(badges, resolvedSearchParams?.badgeId);
  const tabHref = `?${new URLSearchParams({ tab }).toString()}`;
  const buildBadgeHref = (badgeId: string) =>
    `?${new URLSearchParams({ tab, badgeId }).toString()}`;
  const { tabs, tabIds, panelIds } = buildServerTabsConfig<OpenBadgeTab>(
    tabsBaseId,
    openBadgeTabs.map((value) => ({
      value,
      label: t(`tabs.${value}`)
    }))
  );

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
        tabs={tabs}
      />

      <Section
        id={panelIds.all}
        role="tabpanel"
        aria-labelledby={tabIds.all}
        hidden={tab !== 'all'}
      >
        {badges.map((badge) => (
          <OpenBadgeCard key={badge.id} badge={badge} href={buildBadgeHref(badge.id)} />
        ))}
      </Section>
      <Section
        id={panelIds.mine}
        role="tabpanel"
        aria-labelledby={tabIds.mine}
        hidden={tab !== 'mine'}
      >
        {myBadges.map((badge) => (
          <OpenBadgeCard key={badge.id} badge={badge} href={buildBadgeHref(badge.id)} />
        ))}
      </Section>

      <OpenBadgeModalRoute openBadge={selectedBadge} closeHref={tabHref} />
    </>
  );
}
