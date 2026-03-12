import type { JSX } from 'react';
import type { SvgIconProps } from '@mui/material/SvgIcon';
import UserNetworkGraphNodeBubble from './user-network-node-bubble';
import UserNetworkGraphNodeTooltip from './user-network-node-tooltip';
import UserNetworkGraphNodeShell from './user-network-node-shell';

type RoleBadgeIcon = (props: SvgIconProps) => JSX.Element;

type RoleVisual = {
  color: string;
  Icon: RoleBadgeIcon;
};

type UserNetworkGraphNodeData = {
  userId: string;
  fullName: string;
  avatarUrl?: string | null;
  roleLabel: string;
  roleVisual: RoleVisual;
  x: number;
  y: number;
  diameter: number;
  inactive: boolean;
  isActive: boolean;
  isPinned: boolean;
};

type UserNetworkGraphNodeHandlers = {
  onFocusNode: (userId: string) => void;
  onBlurNode: (userId: string) => void;
  onTogglePin: (userId: string) => void;
};

type UserNetworkGraphNodeProps = {
  node: UserNetworkGraphNodeData;
  avatarDiameterPx: number;
  handlers: UserNetworkGraphNodeHandlers;
};

export default function UserNetworkGraphNode({ node, avatarDiameterPx, handlers }: UserNetworkGraphNodeProps) {
  const roleBadgeIcon = node.roleVisual.Icon;

  return (
    <UserNetworkGraphNodeShell
      userId={node.userId}
      x={node.x}
      y={node.y}
      fullName={node.fullName}
      roleLabel={node.roleLabel}
      inactive={node.inactive}
      isActive={node.isActive}
      isPinned={node.isPinned}
      handlers={handlers}
    >
      <UserNetworkGraphNodeTooltip
        open={node.isActive}
        fullName={node.fullName}
        roleLabel={node.roleLabel}
        roleColor={node.roleVisual.color}
      >
        <UserNetworkGraphNodeBubble
          avatarUrl={node.avatarUrl ?? undefined}
          bubbleDiameterPx={node.diameter}
          avatarDiameterPx={avatarDiameterPx}
          roleBadgeColor={node.roleVisual.color}
          roleBadgeIcon={roleBadgeIcon}
          showFocusRing={node.isActive}
        />
      </UserNetworkGraphNodeTooltip>
    </UserNetworkGraphNodeShell>
  );
}
