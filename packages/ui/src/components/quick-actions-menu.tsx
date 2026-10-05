'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { BottomNavigationAction } from '@mui/material';
import MuiBottomNavigation from '@mui/material/BottomNavigation';
import BottomSlot from './bottom-slot';
import { buildQuickActionsMenuItems } from './quick-actions';
import Link from './link';
import DrawerMenu from './drawer-menu';
import UserAvatar from './user-avatar';
import styles from './quick-actions-menu.module.css';

export type QuickActionsMenuProps = {
  user?: {
    email?: string | null;
    image?: string | null;
    avatar?: import('@repo/avatar-system').AvatarSelection | null;
  } | null;
  isAdmin?: boolean;
  canManageUsers?: boolean;
  canManageBadges?: boolean;
};

export default function QuickActionsMenu({
  user = null,
  isAdmin = false,
  canManageUsers = false,
  canManageBadges = false
}: QuickActionsMenuProps) {
  const t = useTranslations('pages.hub.navigation');
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const quickActionItems = buildQuickActionsMenuItems();
  // `false` leaves every action unselected, e.g. on the profile reached through the avatar.
  const currentValue = quickActionItems.find((item) => item.href && pathname?.startsWith(item.href))?.value ?? false;

  return (
    <BottomSlot>
      <div className={styles.avatarPosition}>
        <Link href="/hub/profile" aria-label={t('profile')}>
          <UserAvatar user={user} size={100} />
        </Link>
      </div>
      <MuiBottomNavigation className={styles.root} value={currentValue} showLabels={false}>
        {quickActionItems.map((item) => (
          <BottomNavigationAction
            className={styles.buttons}
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
