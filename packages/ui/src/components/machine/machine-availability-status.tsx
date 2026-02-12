'use client';

import Chip from '@mui/material/Chip';
import clsx from 'clsx';
import type { MachineAvailability } from '@repo/view-models/machine';
import styles from './machine-availability-status.module.css';

export type MachineAvailabilityStatusProps = {
  availability: MachineAvailability;
  label: string;
  size?: 'small' | 'medium';
  className?: string;
};

export default function MachineAvailabilityStatus({
  availability,
  label,
  size = 'small',
  className
}: MachineAvailabilityStatusProps) {
  return (
    <Chip
      className={clsx(styles.root, className)}
      size={size}
      icon={<span className={clsx(styles.dot, styles[availability])} />}
      label={label}
    />
  );
}
