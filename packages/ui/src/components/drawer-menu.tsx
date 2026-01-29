'use client';

import { useTranslations } from 'next-intl';
import CloseIcon from '@mui/icons-material/Close';
import BugReportIcon from '@mui/icons-material/BugReport';
import DraftsIcon from '@mui/icons-material/Drafts';
import SendIcon from '@mui/icons-material/Send';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Link from './link';
import Section from './section';
import SectionSubtitle from './section-subtitle';
import SectionTitle from './section-title';
import MenuList, { MenuListItem } from './menu-list';
import styles from './drawer-menu.module.css';
import { ThemeSection } from '../theme';
import { adminFablabIcon as AdminFablabIcon } from './icons/admin-fablab-icon';
import { adminOpenBadgeIcon as AdminOpenBadgeIcon } from './icons/admin-open-badge-icon';
import { adminUserIcon as AdminUserIcon } from './icons/admin-user-icon';

export type DrawerMenuProps = {
  open: boolean;
  onClose: () => void;
  isAdmin?: boolean;
  canManageUsers?: boolean;
};

export default function DrawerMenu({ open, onClose, isAdmin = false, canManageUsers = false }: DrawerMenuProps) {
  const tSettings = useTranslations('pages.hub.settings');

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          className: `${styles.drawer} sectionTheme-${ThemeSection.User}`
        }
      }}
    >
      <IconButton aria-label={tSettings('drawer.closeLabel')} onClick={onClose} size="small">
        <CloseIcon fontSize="small" />
      </IconButton>
      <Section>
        <SectionTitle>{tSettings('title')}</SectionTitle>
        <SectionSubtitle>{tSettings('subtitle')}</SectionSubtitle>
        <Typography variant="body1">{tSettings('intro')}</Typography>
      </Section>
      <MenuList>
        <MenuListItem
          icon={<SendIcon />}
          label={tSettings('profileLink')}
          href="/hub/settings/profile"
          linkComponent={Link}
          onClick={onClose}
        />
        <MenuListItem
          icon={<DraftsIcon />}
          label={tSettings('avatarLink')}
          href="/hub/settings/avatar"
          linkComponent={Link}
          onClick={onClose}
        />
        <MenuListItem
          icon={<BugReportIcon />}
          label={tSettings('supportLink')}
          href="/hub/support"
          linkComponent={Link}
          onClick={onClose}
        />
      </MenuList>
      {isAdmin ? (
        <>
          <Section>
            <SectionSubtitle>{tSettings('admin.title')}</SectionSubtitle>
          </Section>
          <MenuList>
            <MenuListItem
              icon={<AdminFablabIcon />}
              label={tSettings('admin.machineLink')}
              href="/hub/admin/machines"
              linkComponent={Link}
              onClick={onClose}
            />
            <MenuListItem
              icon={<AdminOpenBadgeIcon />}
              label={tSettings('admin.openBadgeLink')}
              href="/hub/admin/open-badges"
              linkComponent={Link}
              onClick={onClose}
            />
            {canManageUsers ? (
              <MenuListItem
                icon={<AdminUserIcon />}
                label={tSettings('admin.userLink')}
                href="/hub/admin/users"
                linkComponent={Link}
                onClick={onClose}
              />
            ) : null}
          </MenuList>
        </>
      ) : null}
    </Drawer>
  );
}
