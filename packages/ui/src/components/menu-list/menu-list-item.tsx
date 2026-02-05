'use client';

import type { MouseEventHandler, ReactNode } from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import styles from './menu-list-item.module.css';

export type MenuListItemProps = {
  icon: ReactNode;
  label: ReactNode;
  href: string;
  linkComponent: React.ElementType;
  className?: string;
  onClick?: MouseEventHandler<HTMLElement>;
};

export default function MenuListItem({ icon, label, href, linkComponent, className, onClick }: MenuListItemProps) {
  return (
    <ListItemButton
      component={linkComponent}
      href={href}
      onClick={onClick}
      className={className}
      classes={{ root: styles.item }}
    >
      <ListItemIcon className={styles.icon}>{icon}</ListItemIcon>
      <ListItemText primary={label} />
    </ListItemButton>
  );
}
