'use client';

import * as React from 'react';
import { Paper } from '@mui/material';

export default function BottomSlot({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <Paper className={className} sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
      {children}
    </Paper>
  );
}
