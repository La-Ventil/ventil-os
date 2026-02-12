'use client';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import clsx from 'clsx';
import { type MachineViewModel } from '@repo/view-models/machine';
import CardHeader from './card-header';
import { MachineIcon } from './icons/machine-icon';
import MachineAvailabilityStatus from './machine/machine-availability-status';
import styles from './machine-card.module.css';

export type MachineCardData = MachineViewModel;

export type MachineCardProps = {
  machine: MachineCardData;
  onClick?: () => void;
  t: (key: string) => string;
};

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
          <MachineAvailabilityStatus
            availability={machine.availability}
            label={t(`status.${machine.availability}`)}
          />
        </div>
      </CardContent>
    </Card>
  );
}
