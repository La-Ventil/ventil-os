'use client';

import { useMemo } from 'react';
import { useFormatter, useTranslations } from 'next-intl';
import useTimeZone from '../../hooks/use-time-zone';
import {
  createReservationTimeSlotsForInterval,
  createScheduleIntervalForDayKey,
  isReservationSlotInPast,
  isSlotWithinIntervals,
  reservationToClampedSlotRange,
  getNowIndicatorPosition,
  SCHEDULE_END_HOUR,
  SCHEDULE_SLOT_MINUTES,
  SCHEDULE_START_HOUR
} from '@repo/application';
import type { DayKey } from '@repo/application';
import type { MachineReservationViewModel } from '@repo/view-models/machine-reservation';
import MachineReservationCard from './machine-reservation-card';
import MachineScheduleNowIndicator from './machine-schedule-now-indicator';
import MachineReservationTimeSlot from './machine-reservation-time-slot';
import { toZonedDayjs } from '../../utils/dayjs';
import styles from './machine-reservation-schedule.module.css';

export type MachineReservationScheduleProps = {
  dayKey: DayKey;
  reservations: MachineReservationViewModel[];
  onSlotClick?: (slot: Date) => void;
};

export default function MachineReservationSchedule({
  dayKey,
  reservations,
  onSlotClick
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
          const isPast = isReservationSlotInPast(slot, now);
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
              onSelect={canSelect ? () => onSlotClick?.(slot) : undefined}
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

          return (
            <MachineReservationCard
              key={reservation.id}
              reservation={reservation}
              rowStart={rowStart}
              rowEnd={rowEnd}
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
