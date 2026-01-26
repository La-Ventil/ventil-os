import Link from 'next/link';
import clsx from 'clsx';
import styles from './tabs.module.css';
import { getTabId, type TabsProps } from './tabs-utils';

export function Tabs({ ariaLabel, activeValue, baseId, tabs, fullWidth = false }: TabsProps) {
  return (
    <nav className={styles.tabs} aria-label={ariaLabel} role="tablist">
      {tabs.map((tab) => {
        const isDisabled = Boolean(tab.disabled);
        const isActive = tab.value === activeValue && !isDisabled;
        const tabId = getTabId(baseId, tab.value);
        return (
          <Link
            key={tab.value}
            href={tab.href}
            className={clsx(
              styles.tabLink,
              fullWidth && styles.tabLinkFullWidth,
              isDisabled && styles.tabLinkDisabled,
              isActive && styles.tabLinkActive
            )}
            role="tab"
            id={tabId}
            aria-selected={isActive}
            aria-controls={tab.controlsId}
            aria-disabled={isDisabled}
            tabIndex={isActive ? 0 : -1}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
