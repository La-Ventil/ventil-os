'use client';

import { useState, useTransition } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { useFormatter, useTranslations } from 'next-intl';
import type { MachineViewModel } from '@repo/view-models/machine';
import type { MachineReservationViewModel } from '@repo/view-models/machine-reservation';
import { MachineReservation } from '@repo/domain/machine/machine-reservation';
import {
  canCancelReservationNow,
  canReleaseReservationNow,
  type ReservationActor
} from '@repo/domain/machine/machine-reservation-cancellation-policy';
import { listMachineReservationUsers } from '@repo/application';
import { useRouter } from 'next/navigation';
import StatusIndicator from '../status-indicator';
import useTimeZone from '../../hooks/use-time-zone';
import UserAvatar from '../user-avatar';
import CardHeader from '../card-header';
import { MachineIcon } from '../icons/machine-icon';
import styles from './machine-reservation-list-card.module.css';

export type ReservationActionResult = {
  success: boolean;
  message: string;
};

export type MachineReservationListCardProps = {
  reservation: MachineReservationViewModel;
  machine?: MachineViewModel | null;
  fallbackTitle?: string;
  fallbackCategory?: string;
  currentUserId?: string;
  canManageReservations?: boolean;
  onCancel?: (reservationId: string) => Promise<ReservationActionResult>;
  onRelease?: (reservationId: string) => Promise<ReservationActionResult>;
};

export default function MachineReservationListCard({
  reservation,
  machine,
  fallbackTitle,
  fallbackCategory,
  currentUserId,
  canManageReservations,
  onCancel,
  onRelease
}: MachineReservationListCardProps) {
  const timeZone = useTimeZone();
  const format = useFormatter();
  const t = useTranslations('pages.hub.fabLab');
  const router = useRouter();
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isPending, startTransition] = useTransition();
  const users = listMachineReservationUsers(reservation);
  const visibleUsers = users.slice(0, 3);
  const extraUsers = users.length - visibleUsers.length;
  const now = new Date();
  const actor: ReservationActor | null = currentUserId
    ? {
        id: currentUserId,
        globalAdmin: Boolean(canManageReservations)
      }
    : null;
  const isActive = MachineReservation.isActive(reservation, now);
  const canCancel = Boolean(onCancel) && canCancelReservationNow(reservation, actor, now);
  const canRelease = Boolean(onRelease) && canReleaseReservationNow(reservation, actor, now);

  const timeRange = `${format.dateTime(reservation.startsAt, {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone
  })} → ${format.dateTime(reservation.endsAt, { timeStyle: 'short', timeZone })}`;

  const runAction = (action: (id: string) => Promise<ReservationActionResult>, successMessage: string) => {
    startTransition(async () => {
      setFeedback(null);
      const result = await action(reservation.id);
      if (!result.success) {
        setFeedback({ type: 'error', message: result.message });
        return;
      }
      setFeedback({ type: 'success', message: result.message || successMessage });
      router.refresh();
    });
  };

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
          {isActive ? (
            <StatusIndicator tone="success" label={t('reservations.status.inProgress')} />
          ) : null}
        </div>
        <div className={styles.participantsRow}>
          <div className={styles.avatarStack}>
            {visibleUsers.map((user) => (
              <UserAvatar key={user.id} user={{ image: user.image, email: user.email }} size={24} />
            ))}
            {extraUsers > 0 ? <span className={styles.avatarOverflow}>+{extraUsers}</span> : null}
          </div>
        </div>
        {feedback ? (
          <Alert severity={feedback.type} className={styles.feedback}>
            {feedback.message}
          </Alert>
        ) : null}
        {canCancel || canRelease ? (
          <Stack direction="row" className={styles.actionsRow}>
            <Button
              size="small"
              variant="outlined"
              className={styles.actionButton}
              disabled={isPending}
              onClick={() =>
                runAction(
                  canRelease ? onRelease! : onCancel!,
                  canRelease ? t('reservations.success.release') : t('reservations.success.cancel')
                )
              }
            >
              {canRelease ? t('reservations.actions.release') : t('reservations.actions.cancel')}
            </Button>
          </Stack>
        ) : null}
      </CardContent>
    </Card>
  );
}
