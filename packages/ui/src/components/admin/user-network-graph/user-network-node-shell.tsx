import type { ReactNode } from 'react';
import clsx from 'clsx';
import { useUserNetworkGraphNodeInteraction } from './use-user-network-node-interaction';
import styles from './user-network-node-shell.module.css';

type UserNetworkGraphNodeHandlers = {
  onFocusNode: (userId: string) => void;
  onBlurNode: (userId: string) => void;
  onTogglePin: (userId: string) => void;
};

type UserNetworkGraphNodeShellProps = {
  userId: string;
  x: number;
  y: number;
  fullName: string;
  roleLabel: string;
  inactive: boolean;
  isActive: boolean;
  isPinned: boolean;
  handlers: UserNetworkGraphNodeHandlers;
  children: ReactNode;
};

export default function UserNetworkGraphNodeShell({
  userId,
  x,
  y,
  fullName,
  roleLabel,
  inactive,
  isActive,
  isPinned,
  handlers,
  children
}: UserNetworkGraphNodeShellProps) {
  const interaction = useUserNetworkGraphNodeInteraction({
    userId,
    onFocusNode: handlers.onFocusNode,
    onBlurNode: handlers.onBlurNode,
    onTogglePin: handlers.onTogglePin
  });

  return (
    <button
      type="button"
      className={clsx(styles.node, inactive && styles.inactiveNode, isActive && styles.activeNode)}
      style={{ left: x, top: y }}
      title={`${fullName} — ${roleLabel}`}
      aria-label={`${fullName} (${roleLabel})`}
      aria-pressed={isPinned}
      onMouseEnter={interaction.onMouseEnter}
      onMouseLeave={interaction.onMouseLeave}
      onFocus={interaction.onFocus}
      onBlur={interaction.onBlur}
      onClick={interaction.onClick}
    >
      {children}
    </button>
  );
}
