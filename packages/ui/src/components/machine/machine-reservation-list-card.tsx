'use client';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { useFormatter } from 'next-intl';
import type { MachineViewModel } from '@repo/view-models/machine';
import type { MachineReservationViewModel } from '@repo/view-models/machine-reservation';
import { listMachineReservationUsers } from '@repo/application';
import useTimeZone from '../../hooks/use-time-zone';
import UserAvatar from '../user-avatar';
import CardHeader from '../card-header';
import { MachineIcon } from '../icons/machine-icon';
import styles from './machine-reservation-list-card.module.css';

export type MachineReservationListCardProps = {
  reservation: MachineReservationViewModel;
  machine?: MachineViewModel | null;
  fallbackTitle?: string;
  fallbackCategory?: string;
};

export default function MachineReservationListCard({
  reservation,
  machine,
  fallbackTitle,
  fallbackCategory
}: MachineReservationListCardProps) {
  const timeZone = useTimeZone();
  const format = useFormatter();
  const users = listMachineReservationUsers(reservation);
  const visibleUsers = users.slice(0, 3);
  const extraUsers = users.length - visibleUsers.length;

  const timeRange = `${format.dateTime(reservation.startsAt, {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone
  })} → ${format.dateTime(reservation.endsAt, { timeStyle: 'short', timeZone })}`;

  return (
    <Card className={styles.card}>
      <CardHeader
        icon={<MachineIcon color="secondary" />}
        overline={machine?.category ?? fallbackCategory ?? ''}
        title={machine?.name ?? fallbackTitle ?? 'Machine'}
      />
      <CardContent className={styles.content}>
        <div className={styles.metaRow}>
          <Typography variant="body2" className={styles.timeRange}>
            {timeRange}
          </Typography>
          <div className={styles.avatarStack}>
            {visibleUsers.map((user) => (
              <UserAvatar key={user.id} user={{ image: user.image, email: user.email }} size={24} />
            ))}
            {extraUsers > 0 ? <span className={styles.avatarOverflow}>+{extraUsers}</span> : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
