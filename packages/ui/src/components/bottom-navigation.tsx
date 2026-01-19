'use client';

import * as React from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import MenuIcon from '@mui/icons-material/Menu';
import { BottomNavigationAction } from '@mui/material';
import MuiBottomNavigation from '@mui/material/BottomNavigation';
import BottomSlot from './bottom-slot';
import { EventIcon } from './icons/event-icon';
import { MachineIcon } from './icons/machine-icon';
import { OpenBadgeIcon } from './icons/open-badge-icon';
import Link from './link';
import styles from './bottom-navigation.module.css';

export default function BottomNavigation() {
  const t = useTranslations('pages.hub.navigation');
  const [value, setValue] = React.useState('recents');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <BottomSlot className={styles.root}>
      <MuiBottomNavigation value={value} onChange={handleChange}>
        <BottomNavigationAction
          label={t('profile')}
          value="profil"
          icon={<Image src="/avatar.svg" alt={'profilUtilisateur.email'} layout="fill" objectFit="contain" />}
        />
        <BottomNavigationAction label={t('machines')} value="machines" icon={<MachineIcon />} disabled />
        <BottomNavigationAction label={t('openBadges')} value="open-badges" icon={<OpenBadgeIcon />} disabled />
        <BottomNavigationAction label={t('events')} value="evenements" icon={<EventIcon />} disabled />
        <BottomNavigationAction
          component={Link}
          label={t('settings')}
          value="parametres"
          icon={<MenuIcon />}
          href={'/hub/parametres'}
        />
      </MuiBottomNavigation>
    </BottomSlot>
  );
}
