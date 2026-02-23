'use client';

import Chip from '@mui/material/Chip';
import clsx from 'clsx';
import styles from './status-indicator.module.css';

export type StatusTone = 'success' | 'warning' | 'error' | 'info' | 'neutral';

export type StatusIndicatorProps = {
  tone: StatusTone;
  label: string;
  size?: 'small' | 'medium';
  className?: string;
};

export default function StatusIndicator({
  tone,
  label,
  size = 'small',
  className
}: StatusIndicatorProps) {
  return (
    <Chip
      className={clsx(styles.root, className)}
      size={size}
      icon={<span className={clsx(styles.dot, styles[tone])} />}
      label={label}
    />
  );
}
