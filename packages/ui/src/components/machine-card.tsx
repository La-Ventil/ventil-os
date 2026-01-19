'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import clsx from 'clsx';
import type { Machine, MachineAvailability as DomainMachineAvailability } from '@repo/domain/machine';
import { MachineIcon } from './icons/machine-icon';
import styles from './machine-card.module.css';

export type MachineAvailability = DomainMachineAvailability;
export type MachineCardData = Machine;

export type MachineCardProps = {
  machine: MachineCardData;
  onClick?: () => void;
};

const availabilityClassName: Record<MachineAvailability, string> = {
  available: styles.statusDotAvailable,
  reserved: styles.statusDotReserved,
  occupied: styles.statusDotOccupied
};

export default function MachineCard({ machine, onClick }: MachineCardProps) {
  const isInteractive = Boolean(onClick);

  return (
    <Card
      className={clsx(styles.card, isInteractive && styles.cardInteractive)}
      onClick={onClick}
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      onKeyDown={(event) => {
        if (!isInteractive) {
          return;
        }

        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onClick?.();
        }
      }}
    >
      <CardContent>
        <Stack spacing={2}>
          <div className={styles.header}>
            <MachineIcon />
            <Box>
              <Typography variant="caption" color="primary" className={styles.category}>
                {machine.category}
              </Typography>
              <Typography variant="subtitle1">{machine.title}</Typography>
            </Box>
          </div>

          <Box display="flex" gap={2} alignItems="flex-start">
            <div className={styles.illustration}>
              {machine.illustrationLabel ?? 'Illustration en cours'}
            </div>
            <Stack spacing={1} flex={1}>
              <Typography variant="body2" color="text.secondary">
                {machine.description}
              </Typography>
              <div className={styles.statusRow}>
                <span
                  className={clsx(styles.statusDot, availabilityClassName[machine.status.availability])}
                />
                <Typography variant="caption">{machine.status.label}</Typography>
              </div>
            </Stack>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
