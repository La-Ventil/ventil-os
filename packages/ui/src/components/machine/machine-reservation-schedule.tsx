'use client';

import { useMemo } from 'react';
import { useFormatter, useTranslations } from 'next-intl';
import useTimeZone from '../../hooks/use-time-zone';
import { createScheduleIntervalForDayKey } from '@repo/application';
import type { DayKey } from '@repo/application';
import {
  createReservationTimeSlotsForInterval,
  getNowIndicatorPosition,
  isSlotWithinIntervals,
  reservationToClampedSlotRange,
  SCHEDULE_END_HOUR,
  SCHEDULE_SLOT_MINUTES,
  SCHEDULE_START_HOUR
} from '@repo/domain/machine/reservation-schedule';
import { isReservationSlotInPast } from '@repo/domain/machine/reservation-rules';
import { MachineReservation } from '@repo/domain/machine/machine-reservation';
import {
  canCancelReservationNow,
  type ReservationActor
} from '@repo/domain/machine/machine-reservation-cancellation-policy';
import type { MachineReservationViewModel } from '@repo/view-models/machine-reservation';
import MachineReservationScheduleCard from './machine-reservation-schedule-card';
import MachineScheduleNowIndicator from './machine-schedule-now-indicator';
import MachineReservationTimeSlot from './machine-reservation-time-slot';
import { toZonedDayjs } from '../../utils/dayjs';
import styles from './machine-reservation-schedule.module.css';

export type MachineReservationScheduleProps = {
  dayKey: DayKey;
  reservations: MachineReservationViewModel[];
  currentUserId?: string;
  canManageReservations?: boolean;
  onSlotClick?: (slot: Date) => void;
  onReservationClick?: (reservation: MachineReservationViewModel) => void;
};

export default function MachineReservationSchedule({
  dayKey,
  reservations,
  currentUserId,
  canManageReservations,
  onSlotClick,
  onReservationClick
}: MachineReservationScheduleProps) {
  const t = useTranslations('pages.hub.fabLab');
  const timeZone = useTimeZone();
  const format = useFormatter();
  const isLocked = !onSlotClick;
  const scheduleInterval = useMemo(
    () => createScheduleIntervalForDayKey(dayKey, timeZone, SCHEDULE_START_HOUR, SCHEDULE_END_HOUR),
    [dayKey, timeZone]
  );
  const reservationIntervals = useMemo(
    () => reservations.map((reservation) => ({ start: reservation.startsAt, end: reservation.endsAt })),
    [reservations]
  );
  const now = toZonedDayjs(new Date(), timeZone).toDate();

  const slots = useMemo(() => createReservationTimeSlotsForInterval(scheduleInterval), [scheduleInterval]);

  const nowIndicatorPosition = useMemo(
    () => getNowIndicatorPosition(scheduleInterval, SCHEDULE_SLOT_MINUTES, now),
    [scheduleInterval, now]
  );

  return (
    <div className={styles.schedule} aria-label={t('modal.schedule.ariaLabel')}>
      <div className={styles.slotList}>
        {slots.map((slot) => {
          const label = format.dateTime(slot, { timeStyle: 'short', timeZone });
          const slotEnd = new Date(slot.getTime() + SCHEDULE_SLOT_MINUTES * 60_000);
          const isPast = isReservationSlotInPast(slotEnd, now);
          const isBooked = isSlotWithinIntervals(slot, reservationIntervals);
          const canSelect = Boolean(onSlotClick) && !isPast && !isBooked;
          return (
            <MachineReservationTimeSlot
              key={slot.toISOString()}
              label={label}
              ariaLabel={t('modal.schedule.slotLabel', { time: label })}
              isPast={isPast}
              isBooked={isBooked}
              isLocked={isLocked}
              onSelect={canSelect ? () => onSlotClick?.(selectReservationStartFromSlot(slot, now)) : undefined}
            />
          );
        })}
      </div>

      <div className={styles.reservationsLayer}>
        {reservations.map((reservation) => {
          const slotRange = reservationToClampedSlotRange(
            { start: reservation.startsAt, end: reservation.endsAt },
            scheduleInterval,
            SCHEDULE_SLOT_MINUTES
          );
          if (!slotRange) return null;
          const rowStart = slotRange.start + 1;
          const rowEnd = slotRange.end + 1;
          const actor: ReservationActor | null = currentUserId
            ? { id: currentUserId, globalAdmin: Boolean(canManageReservations) }
            : null;
          const isEditable =
            Boolean(onReservationClick) && canCancelReservationNow(reservation, actor, now);

          return (
            <MachineReservationScheduleCard
              key={reservation.id}
              reservation={reservation}
              rowStart={rowStart}
              rowEnd={rowEnd}
              onClick={isEditable ? () => onReservationClick?.(reservation) : undefined}
            />
          );
        })}

        {nowIndicatorPosition ? (
          <MachineScheduleNowIndicator
            row={nowIndicatorPosition.row}
            offsetPercent={nowIndicatorPosition.offsetPercent}
          />
        ) : null}
      </div>
    </div>
  );
}

const selectReservationStartFromSlot = (slot: Date, now: Date): Date => {
  if (slot.getTime() >= now.getTime()) {
    return slot;
  }

  const roundedNow = new Date(now);
  roundedNow.setSeconds(0, 0);

  if (roundedNow.getTime() <= now.getTime()) {
    roundedNow.setMinutes(roundedNow.getMinutes() + 1);
  }

  return roundedNow.getTime() > slot.getTime() ? roundedNow : slot;
};
