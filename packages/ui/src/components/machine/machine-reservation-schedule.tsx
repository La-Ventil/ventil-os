'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { formatInTimeZone } from 'date-fns-tz';
import {
  createReservationTimeSlotsForInterval,
  createScheduleInterval,
  reservationToClampedSlotRange,
  getNowIndicatorPosition,
  SCHEDULE_END_HOUR,
  SCHEDULE_SLOT_MINUTES,
  SCHEDULE_START_HOUR
} from '@repo/application';
import type { MachineReservationViewModel } from '@repo/view-models/machine-reservation';
import MachineReservationCard from './machine-reservation-card';
import MachineScheduleNowIndicator from './machine-schedule-now-indicator';
import MachineReservationTimeSlot from './machine-reservation-time-slot';
import styles from './machine-reservation-schedule.module.css';

export type MachineReservationScheduleProps = {
  date: Date;
  reservations: MachineReservationViewModel[];
};

const formatTime = (date: Date, timeZone: string) => formatInTimeZone(date, timeZone, 'HH:mm');

export default function MachineReservationSchedule({ date, reservations }: MachineReservationScheduleProps) {
  const t = useTranslations('pages.hub.fabLab');
  const timeZone = useMemo(() => Intl.DateTimeFormat().resolvedOptions().timeZone, []);
  const scheduleInterval = useMemo(() => createScheduleInterval(date, SCHEDULE_START_HOUR, SCHEDULE_END_HOUR), [date]);

  const slots = useMemo(() => createReservationTimeSlotsForInterval(scheduleInterval), [scheduleInterval]);

  const nowIndicatorPosition = useMemo(
    () => getNowIndicatorPosition(scheduleInterval, SCHEDULE_SLOT_MINUTES),
    [scheduleInterval]
  );

  return (
    <div className={styles.schedule} aria-label={t('modal.schedule.ariaLabel')}>
      <div className={styles.slotList}>
        {slots.map((slot) => (
          <MachineReservationTimeSlot key={slot.toISOString()} label={formatTime(slot, timeZone)} />
        ))}
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
              timeZone={timeZone}
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
