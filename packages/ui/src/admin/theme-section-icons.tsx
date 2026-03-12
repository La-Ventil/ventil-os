import type { ReactNode } from 'react';
import { EventIcon } from '../components/icons/event-icon';
import { MachineIcon } from '../components/icons/machine-icon';
import { OpenBadgeIcon } from '../components/icons/open-badge-icon';
import { ProfileIcon } from '../components/icons/profile-icon';

export type AdminThemeSection = 'fabLab' | 'openBadge' | 'event' | 'user';

export const themeSectionIcons: Record<AdminThemeSection, ReactNode> = {
  fabLab: <MachineIcon fontSize="small" />,
  openBadge: <OpenBadgeIcon fontSize="small" />,
  event: <EventIcon fontSize="small" />,
  user: <ProfileIcon fontSize="small" />
};
