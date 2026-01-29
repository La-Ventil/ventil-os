'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { BottomNavigationAction } from '@mui/material';
import MuiBottomNavigation from '@mui/material/BottomNavigation';
import BottomSlot from './bottom-slot';
import { hubNavigationItems } from './hub-navigation';
import Link from './link';
import DrawerMenu from './drawer-menu';
import styles from './quick-actions-menu.module.css';

export type QuickActionsMenuProps = {
  isAdmin?: boolean;
  canManageUsers?: boolean;
  canManageBadges?: boolean;
};

export default function QuickActionsMenu({
  isAdmin = false,
  canManageUsers = false,
  canManageBadges = false
}: QuickActionsMenuProps) {
  const t = useTranslations('pages.hub.navigation');
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const currentValue =
    hubNavigationItems.find((item) => item.href && pathname?.startsWith(item.href))?.value ??
    hubNavigationItems[0]?.value;

  return (
    <BottomSlot>
      <MuiBottomNavigation className={styles.root} value={currentValue} showLabels={false}>
        {hubNavigationItems.map((item) => (
          <BottomNavigationAction
            key={item.value}
            component={item.href ? Link : 'button'}
            aria-label={t(item.labelKey)}
            value={item.value}
            icon={item.icon}
            href={item.href}
            disabled={item.disabled}
            onClick={() => {
              if (item.action === 'drawer') {
                setDrawerOpen(true);
              }
            }}
            showLabel={false}
          />
        ))}
      </MuiBottomNavigation>
      <DrawerMenu
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        isAdmin={isAdmin}
        canManageUsers={canManageUsers}
        canManageBadges={canManageBadges}
      />
    </BottomSlot>
  );
}
