import { addMinutes } from 'date-fns';
import type { DateInterval } from './date-interval';

import { getScheduleSlotCount } from './machine-reservation-schedule';

export const SCHEDULE_SLOT_MINUTES = 30;

export const createReservationTimeSlotsForInterval = (interval: DateInterval): Date[] => {
  const totalSlots = getScheduleSlotCount(interval, SCHEDULE_SLOT_MINUTES);
  return Array.from({ length: totalSlots }, (_, index) => addMinutes(interval.start, index * SCHEDULE_SLOT_MINUTES));
};
