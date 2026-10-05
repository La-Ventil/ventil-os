'use client';

import type { ReactNode } from 'react';
import { MachineIcon } from './icons/machine-icon';
import { OpenBadgeIcon } from './icons/open-badge-icon';
import { BurgerIcon } from './icons/burger-icon';

export type QuickActionsItem = {
  value: string;
  labelKey: string;
  href?: string;
  icon: ReactNode;
  disabled?: boolean;
  action?: 'drawer';
};

export const buildQuickActionsMenuItems = (): QuickActionsItem[] => [
  {
    labelKey: 'fabLab',
    value: 'fab-lab',
    href: '/hub/fab-lab/machines',
    icon: <MachineIcon />
  },
  {
    labelKey: 'openBadges',
    value: 'open-badges',
    href: '/hub/open-badge',
    icon: <OpenBadgeIcon />
  },
  {
    labelKey: 'settings',
    value: 'settings',
    icon: <BurgerIcon />,
    action: 'drawer'
  }
];
