'use client';

import * as React from 'react';
import { Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

const FixedBottomPaper = styled(Paper)`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
`;

export default function BottomSlot({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <FixedBottomPaper className={className} elevation={3}>
      {children}
    </FixedBottomPaper>
  );
}
