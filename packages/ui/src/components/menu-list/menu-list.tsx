'use client';

import List from '@mui/material/List';
import styles from './menu-list.module.css';

export type MenuListProps = {
  children: React.ReactNode;
};

export default function MenuList({ children }: MenuListProps) {
  return <List className={styles.list}>{children}</List>;
}
