'use client';

import * as React from 'react';
import MuiBottomNavigation, { BottomNavigationProps as MuiBottomNavigationProps } from '@mui/material/BottomNavigation';
import { styled } from '@mui/material/styles';
import { BottomNavigationAction } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import Link from './link';
import { MachineIcon } from './icons/machine-icon';
import { OpenBadgeIcon } from './icons/open-badge-icon';
import { EventIcon } from './icons/event-icon';
import BottomSlot from './bottom-slot';

const StyledBottomNavigation = styled(MuiBottomNavigation)<MuiBottomNavigationProps>(
  ({ theme }) => `
  color: ${theme.palette.success.main}
`
);

export default function BottomNavigation() {
  const t = useTranslations('pages.hub.navigation');
  const [value, setValue] = React.useState('recents');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <BottomSlot>
      <StyledBottomNavigation sx={{ width: 500 }} value={value} onChange={handleChange}>
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
      </StyledBottomNavigation>
    </BottomSlot>
  );
}
