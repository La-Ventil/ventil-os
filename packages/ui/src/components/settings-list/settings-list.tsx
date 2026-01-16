'use client';

import List from '@mui/material/List';
import styles from './settings-list.module.css';

export type SettingsListProps = {
  children: React.ReactNode;
};

export default function SettingsList({ children }: SettingsListProps) {
  return <List className={styles.list}>{children}</List>;
}
