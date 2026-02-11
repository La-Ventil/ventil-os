import { Typography } from '@mui/material';
import type { CSSProperties } from 'react';

import type { MachineReservationViewModel } from '@repo/view-models/machine-reservation';
import { listMachineReservationUsers } from '@repo/application';
import { useFormatter } from 'next-intl';
import useTimeZone from '../../hooks/use-time-zone';
import UserAvatar from '../user-avatar';
import styles from './machine-reservation-card.module.css';

type MachineReservationCardProps = {
  reservation: MachineReservationViewModel;
  rowStart: number;
  rowEnd: number;
};

const MachineReservationCard = ({ reservation, rowStart, rowEnd }: MachineReservationCardProps) => {
  const timeZone = useTimeZone();
  const format = useFormatter();
  const { startsAt, endsAt } = reservation;
  const uniqueUsers = listMachineReservationUsers(reservation);
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
          {format.dateTime(startsAt, { timeStyle: 'short', timeZone })} →{' '}
          {format.dateTime(endsAt, { timeStyle: 'short', timeZone })}
        </Typography>
      </div>
    </div>
  );
};

export default MachineReservationCard;
