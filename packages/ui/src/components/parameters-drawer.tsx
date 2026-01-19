'use client';

import { useTranslations } from 'next-intl';
import CloseIcon from '@mui/icons-material/Close';
import BugReportIcon from '@mui/icons-material/BugReport';
import DraftsIcon from '@mui/icons-material/Drafts';
import SendIcon from '@mui/icons-material/Send';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Link from './link';
import SectionSubtitle from './section-subtitle';
import SectionTitle from './section-title';
import SettingsList, { SettingsListItem } from './settings-list';
import styles from './parameters-drawer.module.css';

export type ParametersDrawerProps = {
  open: boolean;
  onClose: () => void;
};

export default function ParametersDrawer({ open, onClose }: ParametersDrawerProps) {
  const tSettings = useTranslations('pages.hub.settings');

  return (
    <Drawer anchor="left" open={open} onClose={onClose} PaperProps={{ className: styles.drawer }}>
      <Stack spacing={2} className={styles.drawerContent}>
        <div className={styles.drawerHeader}>
          <div className={styles.drawerTitle}>
            <SectionTitle>{tSettings('title')}</SectionTitle>
            <SectionSubtitle>{tSettings('subtitle')}</SectionSubtitle>
            <Typography variant="body1">{tSettings('intro')}</Typography>
          </div>
          <IconButton aria-label={tSettings('drawer.closeLabel')} onClick={onClose} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </div>
        <SettingsList>
          <SettingsListItem
            icon={<SendIcon />}
            label={tSettings('profileLink')}
            href="/hub/parametres/profil"
            linkComponent={Link}
            onClick={onClose}
          />
          <SettingsListItem
            icon={<DraftsIcon />}
            label={tSettings('avatarLink')}
            href="/hub/parametres/avatar"
            linkComponent={Link}
            onClick={onClose}
          />
          <SettingsListItem
            icon={<BugReportIcon />}
            label={tSettings('debugLink')}
            href="/hub/debug"
            linkComponent={Link}
            onClick={onClose}
          />
        </SettingsList>
      </Stack>
    </Drawer>
  );
}
