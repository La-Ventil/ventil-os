'use client';

import Link from 'next/link';
import type { KeyboardEvent } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import clsx from 'clsx';
import { type MachineViewModel, type MachineAvailability } from '@repo/application/machines/models/machine';
import CardHeader from './card-header';
import { MachineIcon } from './icons/machine-icon';
import StatusIndicator, { type StatusTone } from './status-indicator';
import styles from './machine-card.module.css';

export type MachineCardData = MachineViewModel;

export type MachineCardProps = {
  machine: MachineCardData;
  href?: string;
  onClick?: () => void;
  t: (key: string) => string;
};

const availabilityTone: Record<MachineAvailability, StatusTone> = {
  available: 'success',
  reserved: 'warning',
  occupied: 'error'
};

export default function MachineCard({ machine, href, onClick, t }: MachineCardProps) {
  const isInteractive = Boolean(onClick || href);
  return (
    <Card
      className={clsx(styles.card, isInteractive && styles.cardInteractive)}
      component={href ? Link : 'div'}
      href={href}
      onClick={href ? undefined : onClick}
      role={isInteractive ? 'button' : undefined}
      tabIndex={href ? undefined : isInteractive ? 0 : undefined}
      onKeyDown={(event: KeyboardEvent) => {
        if (!isInteractive || href) {
          return;
        }

        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onClick?.();
        }
      }}
    >
      <CardHeader
        icon={<MachineIcon color="secondary" />}
        overline={machine.category}
        overlineClassName={styles.category}
        title={machine.name}
      />
      <CardContent className={styles.content}>
        <CardMedia className={styles.illustration} component="div">
          {machine.imageUrl ? <img src={machine.imageUrl} alt={machine.name} /> : 'Illustration en cours'}
        </CardMedia>
        <div className={styles.details}>
          <Typography variant="body2" color="text.primary">
            {machine.description}
          </Typography>
          <StatusIndicator tone={availabilityTone[machine.availability]} label={t(`status.${machine.availability}`)} />
        </div>
      </CardContent>
    </Card>
  );
}
