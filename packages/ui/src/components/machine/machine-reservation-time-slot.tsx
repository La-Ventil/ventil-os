'use client';

import type { JSX } from 'react';
import Typography from '@mui/material/Typography';
import styles from './machine-reservation-time-slot.module.css';

export type MachineReservationTimeSlotProps = {
  label: string;
};

export default function MachineReservationTimeSlot({ label }: MachineReservationTimeSlotProps): JSX.Element {
  return (
    <div className={styles.slotRow}>
      <Typography variant="caption" className={styles.timeLabel}>
        {label}
      </Typography>
      <div className={styles.slotCell} />
    </div>
  );
}
