import type { JSX } from 'react';
import type { SvgIconProps } from '@mui/material/SvgIcon';
import type { UserRole } from '@repo/domain/user/user-role';
import type { AdminMetricCardTone } from '../components/admin/admin-metric-card';
import { LogoIcon } from '../components/icons/logo-icon';
import { ProfileSmallIcon } from '../components/icons/profile-small-icon';

type RoleBadgeIcon = (props: SvgIconProps) => JSX.Element;

type UserRoleVisualConfig = {
  Icon: RoleBadgeIcon;
  color: string;
};

type UserRoleTone = Record<UserRole, AdminMetricCardTone>;

export const userRoleVisualByRole: Record<UserRole, UserRoleVisualConfig> = {
  member: {
    Icon: LogoIcon,
    color: '#317bf4'
  },
  alumni: {
    Icon: ProfileSmallIcon,
    color: '#317bf4'
  },
  teacher: {
    Icon: ProfileSmallIcon,
    color: '#317bf4'
  },
  contributor: {
    Icon: ProfileSmallIcon,
    color: '#d6a20a'
  },
  visitor: {
    Icon: ProfileSmallIcon,
    color: '#e64f2a'
  }
};

export const userRoleToneByRole: UserRoleTone = {
  member: 'blue',
  alumni: 'blue',
  teacher: 'blue',
  contributor: 'yellow',
  visitor: 'red'
};
