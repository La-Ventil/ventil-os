import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import styles from './auth-panel.module.css';

export const authPanelTitleClassName = styles.title;

/** Centres an authentication form in a raised panel. */
export default function AuthPanel({ children }: { children: ReactNode }) {
  return (
    <Box className={styles.root}>
      <Box className={styles.panel}>{children}</Box>
    </Box>
  );
}
