import React from 'react';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { TabsLayout } from '@repo/ui/tabs';

export const openBadgeTabs = ['all', 'mine'] as const;
export type OpenBadgeTab = (typeof openBadgeTabs)[number];
export const openBadgeTabsBaseId = 'open-badge-tabs';
export const isOpenBadgeTab = (value: string): value is OpenBadgeTab =>
  openBadgeTabs.includes(value as OpenBadgeTab);

type LayoutProps = {
  children: React.ReactNode;
  modal: React.ReactNode;
  params: Promise<{ tab: string }>;
};

export default async function OpenBadgeTabLayout({
  children,
  modal,
  params
}: LayoutProps): Promise<React.ReactElement> {
  const { tab: rawTab } = await params;

  if (!isOpenBadgeTab(rawTab)) {
    notFound();
  }

  const tab: OpenBadgeTab = rawTab;
  const t = await getTranslations('pages.hub.openBadges');
  return (
    <>
      <TabsLayout
        ariaLabel={t('tabs.ariaLabel')}
        activeValue={tab}
        baseId={openBadgeTabsBaseId}
        tabs={openBadgeTabs}
        getLabel={(value) => t(`tabs.${value}`)}
        getHref={(value) => `/hub/open-badge/${value}`}
        fullWidth
        renderPanel={(value, panelProps) =>
          value !== tab ? null : (
            <div
              id={panelProps.id}
              role="tabpanel"
              aria-labelledby={panelProps.tabId}
              hidden={panelProps.hidden}
            >
              {children}
            </div>
          )
        }
      />
      {modal}
    </>
  );
}
