'use client';

import clsx from 'clsx';
import { Stack, type StackProps } from '@mui/material';
import styles from './grid-background.module.css';

export type GridBackgroundProps = StackProps;

export default function GridBackground({ className, component = 'section', ...props }: GridBackgroundProps) {
  return <Stack className={clsx(styles.root, className)} component={component} {...props} />;
}
