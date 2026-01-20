'use client';

import Image from 'next/image';
import type { ReactNode } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import { EventIcon } from './icons/event-icon';
import { MachineIcon } from './icons/machine-icon';
import { OpenBadgeIcon } from './icons/open-badge-icon';

export type HubNavigationItem = {
  value: string;
  labelKey: string;
  href?: string;
  icon: ReactNode;
  disabled?: boolean;
  action?: 'drawer';
};

export const hubNavigationItems: HubNavigationItem[] = [
  {
    labelKey: 'profile',
    value: 'profile',
    href: '/hub/profile',
    icon: <Image src="/avatar.svg" alt={'profile.email'} layout="fill" objectFit="contain" />
  },
  {
    labelKey: 'fabLab',
    value: 'fab-lab',
    href: '/hub/fab-lab',
    icon: <MachineIcon />
  },
  {
    labelKey: 'openBadges',
    value: 'open-badges',
    href: '/hub/open-badge',
    icon: <OpenBadgeIcon />
  },
  {
    labelKey: 'events',
    value: 'events',
    href: '/hub/events',
    icon: <EventIcon />
  },
  {
    labelKey: 'settings',
    value: 'settings',
    icon: <MenuIcon />,
    action: 'drawer'
  }
];
