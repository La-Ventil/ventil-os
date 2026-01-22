import Link from 'next/link';
import clsx from 'clsx';
import styles from './server-tabs.module.css';

export type ServerTabItem = {
  value: string;
  label: string;
  href: string;
  controlsId?: string;
};

export type ServerTabDefinition<T extends string = string> = {
  value: T;
  label: string;
  href?: string;
};

export type ServerTabsConfig<T extends string = string> = {
  tabs: ServerTabItem[];
  tabIds: Record<T, string>;
  panelIds: Record<T, string>;
};

export type ServerTabsProps = {
  ariaLabel: string;
  activeValue: string;
  baseId?: string;
  tabs: ServerTabItem[];
};

export const getServerTabId = (baseId: string, value: string) => `${baseId}-tab-${value}`;
export const getServerPanelId = (baseId: string, value: string) => `${baseId}-panel-${value}`;

export const buildServerTabsConfig = <T extends string>(
  baseId: string,
  tabs: ServerTabDefinition<T>[],
  buildHref: (value: T) => string = (value) => `?tab=${value}`
): ServerTabsConfig<T> => {
  const tabIds = {} as Record<T, string>;
  const panelIds = {} as Record<T, string>;
  const items = tabs.map((tab) => {
    tabIds[tab.value] = getServerTabId(baseId, tab.value);
    panelIds[tab.value] = getServerPanelId(baseId, tab.value);
    return {
      ...tab,
      href: tab.href ?? buildHref(tab.value),
      controlsId: panelIds[tab.value]
    };
  });

  return {
    tabs: items,
    tabIds,
    panelIds
  };
};

export default function ServerTabs({
  ariaLabel,
  activeValue,
  baseId = 'tabs',
  tabs
}: ServerTabsProps) {
  return (
    <nav className={styles.tabs} aria-label={ariaLabel} role="tablist">
      {tabs.map((tab) => {
        const isActive = tab.value === activeValue;
        const tabId = getServerTabId(baseId, tab.value);
        return (
          <Link
            key={tab.value}
            href={tab.href}
            className={clsx(styles.tabLink, isActive && styles.tabLinkActive)}
            role="tab"
            id={tabId}
            aria-selected={isActive}
            aria-controls={tab.controlsId}
            tabIndex={isActive ? 0 : -1}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
