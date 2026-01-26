import type { ReactNode } from 'react';
import { Tabs } from './tabs';
import { buildTabs, renderPanels, type TabPanelRenderProps } from './tabs-utils';

export type TabsLayoutProps<T extends string = string> = {
  ariaLabel: string;
  baseId: string;
  tabs: readonly T[];
  activeValue: T;
  getLabel: (value: T) => string;
  getHref: (value: T) => string;
  fullWidth?: boolean;
  renderPanel: (value: T, panelProps: TabPanelRenderProps<T>) => ReactNode;
};

export function TabsLayout<T extends string>({
  ariaLabel,
  baseId,
  tabs,
  activeValue,
  getLabel,
  getHref,
  fullWidth = false,
  renderPanel
}: TabsLayoutProps<T>) {
  const { tabs: tabItems } = buildTabs({
    baseId,
    tabs,
    getLabel,
    getHref
  });

  return (
    <>
      <Tabs
        ariaLabel={ariaLabel}
        activeValue={activeValue}
        baseId={baseId}
        tabs={tabItems}
        fullWidth={fullWidth}
      />
      {renderPanels({
        baseId,
        tabs,
        activeValue,
        render: renderPanel
      })}
    </>
  );
}
