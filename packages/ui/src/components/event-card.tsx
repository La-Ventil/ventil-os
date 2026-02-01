'use client';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import type { EventViewModel } from '@repo/view-models/event';
import CardHeader from './card-header';
import { EventIcon } from './icons/event-icon';
import styles from './event-card.module.css';

export type EventCardProps = {
  event: EventViewModel;
  t: (key: string) => string;
};

type EventMetaProps = {
  label: string;
  value: React.ReactNode;
  secondary?: React.ReactNode;
};

function EventMeta({ label, value, secondary }: EventMetaProps) {
  return (
    <Grid size={6}>
      <Typography variant="caption" color="text.primary" className={styles.metaLabel}>
        {label}
      </Typography>
      <Typography variant="body2" color="text.primary" className={styles.metaValue}>
        {value}
      </Typography>
      {secondary ? (
        <Typography variant="body2" color="text.primary" className={styles.metaValue}>
          {secondary}
        </Typography>
      ) : null}
    </Grid>
  );
}

export default function EventCard({ event, t }: EventCardProps) {
  return (
    <Card className={styles.card}>
      <CardHeader icon={<EventIcon color="secondary" />} overline={event.type} title={event.name} />
      <CardContent className={styles.content}>
        <Grid container rowSpacing={1.5} columnSpacing={2}>
          <EventMeta label={t('card.labels.date')} value={event.startDate} />
          <EventMeta label={t('card.labels.location')} value={event.location} />
          <EventMeta label={t('card.labels.audience')} value={event.audience} />
          <EventMeta
            label={t('card.labels.registration')}
            value={`${event.registration.current} / ${event.registration.capacity}`}
          />
        </Grid>
        <Typography variant="body2" color="text.primary" mt={2}>
          {event.description}
        </Typography>
      </CardContent>
    </Card>
  );
}
