'use client';

import type { StackProps } from '@mui/material';
import GridBackground from './grid-background';

export type CardListProps = StackProps;

export default function CardList({ children, component = 'section', p = 2, spacing = 2, ...props }: CardListProps) {
  return (
    <GridBackground component={component} p={p} spacing={spacing} {...props}>
      {children}
    </GridBackground>
  );
}
