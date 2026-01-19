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
        <IconButton aria-label={tSettings('drawer.closeLabel')} onClick={onClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      <Section>
          <SectionTitle>{tSettings('title')}</SectionTitle>
          <SectionSubtitle>{tSettings('subtitle')}</SectionSubtitle>
          <Typography variant="body1">{tSettings('intro')}</Typography>
      </Section>
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
    </Drawer>
  );
}
