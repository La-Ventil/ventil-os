'use client';

import { useTranslations } from 'next-intl';
import BugReportIcon from '@mui/icons-material/BugReport';
import SettingsIcon from '@mui/icons-material/Settings';
import Drawer from '@mui/material/Drawer';
import type { PaperProps } from '@mui/material/Paper';
import Link from './link';
import Map from './map';
import MenuList, { MenuListItem } from './menu-list';
import styles from './drawer-menu.module.css';
import { adminFablabIcon as AdminFablabIcon } from './icons/admin-fablab-icon';
import { adminOpenBadgeIcon as AdminOpenBadgeIcon } from './icons/admin-open-badge-icon';
import { adminUserIcon as AdminUserIcon } from './icons/admin-user-icon';
import { EventIcon } from './icons/event-icon';
import { MachineIcon } from './icons/machine-icon';
import { OpenBadgeIcon } from './icons/open-badge-icon';
import { logoutIcon as LogoutIcon } from './icons/logout-icon';
import { getThemeSectionClassName, ThemeSection } from '../theme';

export type DrawerMenuProps = {
  open: boolean;
  onClose: () => void;
  isAdmin?: boolean;
  canManageUsers?: boolean;
};

export default function DrawerMenu({ open, onClose, isAdmin = false, canManageUsers = false }: DrawerMenuProps) {
  const tDrawer = useTranslations('pages.hub.drawer');

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          className: `${styles.drawer}`,
          'data-mui-color-scheme': 'dark'
        } as PaperProps
      }}
    >
      <Map ariaLabel={tDrawer('map.ariaLabel')} />
      <MenuList>
        <MenuListItem
          icon={<MachineIcon />}
          label={tDrawer('links.machines')}
          href="/hub/fab-lab"
          linkComponent={Link}
          className={getThemeSectionClassName(ThemeSection.FabLab)}
          onClick={onClose}
        />
        <MenuListItem
          icon={<OpenBadgeIcon />}
          label={tDrawer('links.openBadges')}
          href="/hub/open-badge"
          linkComponent={Link}
          className={getThemeSectionClassName(ThemeSection.OpenBadge)}
          onClick={onClose}
        />
        <MenuListItem
          icon={<EventIcon />}
          label={tDrawer('links.events')}
          href="/hub/events"
          linkComponent={Link}
          className={getThemeSectionClassName(ThemeSection.Event)}
          onClick={onClose}
        />
        <MenuListItem
          icon={<SettingsIcon />}
          label={tDrawer('links.settings')}
          href="/hub/settings"
          linkComponent={Link}
          className={getThemeSectionClassName(ThemeSection.User)}
          onClick={onClose}
        />
        <MenuListItem
          icon={<BugReportIcon />}
          label={tDrawer('links.support')}
          href="/hub/support"
          linkComponent={Link}
          className={getThemeSectionClassName(ThemeSection.Support)}
          onClick={onClose}
        />

        {isAdmin ? (
          <>
            <MenuListItem
              icon={<AdminFablabIcon />}
              label={tDrawer('admin.machineLink')}
              href="/hub/admin/machines"
              linkComponent={Link}
              className={getThemeSectionClassName(ThemeSection.Admin)}
              onClick={onClose}
            />
            <MenuListItem
              icon={<AdminOpenBadgeIcon />}
              label={tDrawer('admin.openBadgeLink')}
              href="/hub/admin/open-badges"
              linkComponent={Link}
              className={getThemeSectionClassName(ThemeSection.Admin)}
              onClick={onClose}
            />
            {canManageUsers ? (
              <MenuListItem
                icon={<AdminUserIcon />}
                label={tDrawer('admin.userLink')}
                href="/hub/admin/users"
                linkComponent={Link}
                className={getThemeSectionClassName(ThemeSection.Admin)}
                onClick={onClose}
              />
            ) : null}
          </>
        ) : null}
        <MenuListItem
          icon={<LogoutIcon />}
          label={tDrawer('links.signout')}
          href="/api/auth/signout"
          linkComponent={Link}
          className={getThemeSectionClassName(ThemeSection.Support)}
          onClick={onClose}
        />
      </MenuList>
    </Drawer>
  );
}
