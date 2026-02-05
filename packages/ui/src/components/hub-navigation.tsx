'use client';

import type { ReactNode } from 'react';
import { EventIcon } from './icons/event-icon';
import { MachineIcon } from './icons/machine-icon';
import { OpenBadgeIcon } from './icons/open-badge-icon';
import { BurgerIcon } from './icons/burger-icon';
import UserAvatar from './user-avatar';

export type HubNavigationItem = {
  value: string;
  labelKey: string;
  href?: string;
  icon: ReactNode;
  disabled?: boolean;
  action?: 'drawer';
};

export const buildHubNavigationItems = ({
  user
}: {
  user?: {
    email?: string | null;
    image?: string | null;
  } | null;
} = {}): HubNavigationItem[] => [
  {
    labelKey: 'profile',
    value: 'profile',
    href: '/hub/profile',
    icon: <UserAvatar user={user} objectFit="contain" fill />
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
    icon: <BurgerIcon />,
    action: 'drawer'
  }
];
