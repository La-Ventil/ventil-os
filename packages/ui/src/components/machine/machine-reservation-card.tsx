import { Typography } from '@mui/material';
import type { CSSProperties } from 'react';

import type { MachineReservationViewModel } from '@repo/view-models/machine-reservation';
import { formatInTimeZone } from 'date-fns-tz';

import UserAvatar from '../user-avatar';
import styles from './machine-reservation-card.module.css';

type MachineReservationCardProps = {
  reservation: MachineReservationViewModel;
  timeZone: string;
  rowStart: number;
  rowEnd: number;
};

const formatTime = (date: Date, timeZone: string) => formatInTimeZone(date, timeZone, 'HH:mm');

const MachineReservationCard = ({ reservation, timeZone, rowStart, rowEnd }: MachineReservationCardProps) => {
  const start = reservation.startsAt;
  const end = reservation.endsAt;
  const users = [reservation.creator, ...reservation.participants.map((participant) => participant.user)];
  const uniqueUsers = Array.from(new Map(users.map((user) => [user.id, user])).values());
  const visibleUsers = uniqueUsers.slice(0, 3);
  const extraUsers = uniqueUsers.length - visibleUsers.length;

  return (
    <div className={styles.reservationCard} style={{ gridRow: `${rowStart} / ${rowEnd}` } as CSSProperties}>
      <div className={styles.reservationHeader}>
        <div className={styles.avatarStack}>
          {visibleUsers.map((user) => (
            <UserAvatar key={user.id} user={{ image: user.image, email: user.email }} size={24} />
          ))}
          {extraUsers > 0 ? <span className={styles.avatarOverflow}>+{extraUsers}</span> : null}
        </div>
        <Typography variant="caption" className={styles.reservationTime}>
          {formatTime(start, timeZone)} → {formatTime(end, timeZone)}
        </Typography>
      </div>
    </div>
  );
};

export default MachineReservationCard;
