import type { JSX } from 'react';
import type { SvgIconProps } from '@mui/material/SvgIcon';
import type { AvatarSelection } from '@repo/avatar-system';
import UserAvatar from '../../user-avatar';
import styles from './user-network-node-bubble.module.css';

type RoleBadgeIcon = (props: SvgIconProps) => JSX.Element;

type UserNetworkGraphNodeBubbleProps = {
  avatar?: AvatarSelection | null;
  avatarUrl?: string | null;
  bubbleDiameterPx: number;
  avatarDiameterPx: number;
  roleBadgeColor: string;
  roleBadgeIcon: RoleBadgeIcon;
  showFocusRing: boolean;
};

export default function UserNetworkGraphNodeBubble({
  avatar,
  avatarUrl,
  bubbleDiameterPx,
  avatarDiameterPx,
  roleBadgeColor,
  roleBadgeIcon: RoleBadgeIcon,
  showFocusRing
}: UserNetworkGraphNodeBubbleProps) {
  return (
    <span className={styles.root}>
      <span className={styles.halo} style={{ width: bubbleDiameterPx, height: bubbleDiameterPx }} aria-hidden />
      <span className={`${styles.bubble} ${showFocusRing ? styles.focused : ''}`} aria-hidden>
        <span className={styles.avatar}>
          <UserAvatar user={{ image: avatarUrl, avatar }} size={avatarDiameterPx} objectFit="cover" avatarNoBody />
        </span>
        <span className={styles.roleBadge} style={{ color: roleBadgeColor }} aria-hidden>
          <RoleBadgeIcon fontSize="inherit" />
        </span>
      </span>
    </span>
  );
}
