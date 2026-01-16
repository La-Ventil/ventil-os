'use client';

import * as React from 'react';
import { Paper } from '@mui/material';
import styles from './bottom-slot.module.css';

export default function BottomSlot({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <Paper className={[styles.root, className].filter(Boolean).join(' ')} elevation={3}>
      {children}
    </Paper>
  );
}
