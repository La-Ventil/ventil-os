'use client';

import type { JSX } from 'react';
import clsx from 'clsx';
import Typography from '@mui/material/Typography';
import styles from './machine-reservation-time-slot.module.css';

export type MachineReservationTimeSlotProps = {
  label: string;
  ariaLabel?: string;
  onSelect?: () => void;
  isPast?: boolean;
  isBooked?: boolean;
};

export default function MachineReservationTimeSlot({
  label,
  ariaLabel,
  onSelect,
  isPast = false,
  isBooked = false
}: MachineReservationTimeSlotProps): JSX.Element {
  const isAvailable = Boolean(onSelect) && !isPast && !isBooked;
  const isDisabled = !isAvailable;

  return (
    <div className={styles.slotRow}>
      <Typography variant="caption" className={styles.timeLabel}>
        {label}
      </Typography>
      <button
        type="button"
        className={clsx(
          styles.slotCell,
          isAvailable && styles.slotCellAvailable,
          isPast && styles.slotCellPast,
          isBooked && styles.slotCellBooked
        )}
        aria-label={ariaLabel ?? label}
        onClick={onSelect}
        disabled={isDisabled}
      />
    </div>
  );
}
