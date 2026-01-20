'use client';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import clsx from 'clsx';
import { MachineAvailability, type Machine } from '@repo/domain/machine';
import CardHeader from './card-header';
import { MachineIcon } from './icons/machine-icon';
import styles from './machine-card.module.css';

export type MachineCardData = Machine;

export type MachineCardProps = {
  machine: MachineCardData;
  onClick?: () => void;
  t: (key: string) => string;
};

type MachineAvailabilityStatusProps = {
  availability: MachineAvailability;
  t: (key: string) => string;
};

function MachineAvailabilityStatus({ availability, t }: MachineAvailabilityStatusProps) {
  const label = t(`status.${availability}`);

  return (
    <div className={styles.statusRow}>
      <span className={clsx(styles.statusDot, styles[availability])} />
      <Typography variant="caption" className={styles.statusLabel}>
        {label}
      </Typography>
    </div>
  );
}

export default function MachineCard({ machine, onClick, t }: MachineCardProps) {
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
      <CardHeader
        icon={<MachineIcon />}
        overline={machine.category}
        overlineClassName={styles.category}
        title={machine.title}
      />
      <CardContent className={styles.content}>
        <CardMedia className={styles.illustration} component="div">
          {machine.illustrationLabel ?? 'Illustration en cours'}
        </CardMedia>
        <div className={styles.details}>
          <Typography variant="body2" color="text.secondary">
            {machine.description}
          </Typography>
          <MachineAvailabilityStatus availability={machine.availability} t={t} />
        </div>
      </CardContent>
    </Card>
  );
}
