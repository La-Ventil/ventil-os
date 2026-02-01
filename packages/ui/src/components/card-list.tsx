'use client';

import { Stack, type StackProps } from '@mui/material';
import styles from './card-list.module.css';

export type CardListProps = StackProps;

export default function CardList({ children, component = 'section', p = 2, spacing = 2, ...props }: CardListProps) {
  return (
    <Stack className={styles.root} component={component} p={p} spacing={spacing} {...props}>
      {children}
    </Stack>
  );
}
