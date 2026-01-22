import Link from 'next/link';
import clsx from 'clsx';
import styles from './server-tabs.module.css';

export type ServerTabItem = {
  value: string;
  label: string;
  href: string;
  controlsId?: string;
};

export type ServerTabsProps = {
  ariaLabel: string;
  activeValue: string;
  baseId?: string;
  tabs: ServerTabItem[];
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
        const tabId = `${baseId}-tab-${tab.value}`;
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
