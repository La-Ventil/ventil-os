import type { DayKey } from './date-time';
import { addMinutesToDate, differenceInMinutes, parseDayKey } from './date-time';

import type { DateInterval } from './date-interval';
import { SCHEDULE_SLOT_MINUTES } from './reservation-time-slots';

export type SlotIndexRange = {
  start: number;
  end: number;
};

export type NowIndicatorPosition = {
  row: number;
  offsetPercent: string;
};

export const SCHEDULE_START_HOUR = 8;
export const SCHEDULE_END_HOUR = 23.5;

const clampDate = (date: Date, bounds: DateInterval): Date => {
  const min = bounds.start.getTime();
  const max = bounds.end.getTime();
  const value = date.getTime();
  return new Date(Math.min(Math.max(value, min), max));
};

export const assertReservationInterval = (interval: DateInterval, context?: string): void => {
  if (interval.end <= interval.start) {
    const suffix = context ? ` (${context})` : '';
    throw new Error(`Invalid reservation interval: endsAt must be after startsAt${suffix}`);
  }
};

// Half-open interval overlap: [start, end)
export const intervalsOverlap = (left: DateInterval, right: DateInterval): boolean =>
  left.start < right.end && left.end > right.start;

export const intervalOverlapsAny = (interval: DateInterval, intervals: DateInterval[]): boolean =>
  intervals.some((candidate) => intervalsOverlap(interval, candidate));

export const clampInterval = (interval: DateInterval, bounds: DateInterval): DateInterval | null => {
  const clampedStart = clampDate(interval.start, bounds);
  const clampedEnd = clampDate(interval.end, bounds);

  if (clampedEnd <= bounds.start || clampedStart >= bounds.end) {
    return null;
  }

  return { start: clampedStart, end: clampedEnd };
};

const minutesToSlotIndex = (minutes: number, minutesPerSlot: number, strategy: 'floor' | 'ceil') => {
  const value = minutes / minutesPerSlot;
  return strategy === 'floor' ? Math.floor(value) : Math.ceil(value);
};

export const intervalToSlotRange = (
  interval: DateInterval,
  scheduleStart: Date,
  minutesPerSlot: number
): SlotIndexRange => {
  const startMinutes = differenceInMinutes(interval.start, scheduleStart);
  const endMinutes = differenceInMinutes(interval.end, scheduleStart);
  return {
    start: minutesToSlotIndex(startMinutes, minutesPerSlot, 'floor'),
    end: minutesToSlotIndex(endMinutes, minutesPerSlot, 'ceil')
  };
};

export const clampIntervalToSchedule = (interval: DateInterval, scheduleInterval: DateInterval): DateInterval | null =>
  clampInterval(interval, scheduleInterval);

export const clampSlotRange = (range: SlotIndexRange, totalSlots: number): SlotIndexRange => {
  const start = Math.min(Math.max(range.start, 0), totalSlots);
  const end = Math.min(Math.max(range.end, 0), totalSlots);
  return {
    start,
    end: Math.max(end, start + 1)
  };
};

export const getScheduleSlotCount = (scheduleInterval: DateInterval, minutesPerSlot: number) =>
  Math.max(0, Math.ceil(differenceInMinutes(scheduleInterval.end, scheduleInterval.start) / minutesPerSlot));

export const reservationToClampedSlotRange = (
  reservation: DateInterval,
  scheduleInterval: DateInterval,
  minutesPerSlot: number = SCHEDULE_SLOT_MINUTES
): SlotIndexRange | null => {
  assertReservationInterval(reservation);
  const clampedInterval = clampIntervalToSchedule(reservation, scheduleInterval);
  if (!clampedInterval) return null;
  const slotRange = intervalToSlotRange(clampedInterval, scheduleInterval.start, minutesPerSlot);
  const totalSlots = getScheduleSlotCount(scheduleInterval, minutesPerSlot);
  return clampSlotRange(slotRange, totalSlots);
};

export const createScheduleIntervalForDayKey = (
  dayKey: DayKey,
  timeZone: string,
  startHour: number = SCHEDULE_START_HOUR,
  endHour: number = SCHEDULE_END_HOUR
): DateInterval => {
  const startOfDayDate = parseDayKey(dayKey, timeZone);
  return {
    start: addMinutesToDate(startOfDayDate, Math.round(startHour * 60)),
    end: addMinutesToDate(startOfDayDate, Math.round(endHour * 60))
  };
};

export const getNowIndicatorPosition = (
  scheduleInterval: DateInterval,
  minutesPerSlot: number = SCHEDULE_SLOT_MINUTES,
  now: Date = new Date()
): NowIndicatorPosition | null => {
  if (now < scheduleInterval.start || now >= scheduleInterval.end) return null;

  const minutes = differenceInMinutes(now, scheduleInterval.start);
  const slotOffset = Math.max(0, minutes / minutesPerSlot);
  const slotIndex = Math.floor(slotOffset);
  const slotProgress = slotOffset - slotIndex;

  return {
    row: slotIndex + 1,
    offsetPercent: `${Math.round(slotProgress * 100)}%`
  };
};

export const isReservationSlotInPast = (slot: Date, now: Date = new Date()): boolean =>
  slot.getTime() < now.getTime();

export const isSlotWithinInterval = (slot: Date, interval: DateInterval): boolean =>
  slot >= interval.start && slot < interval.end;

export const isSlotWithinIntervals = (slot: Date, intervals: DateInterval[]): boolean =>
  intervals.some((interval) => isSlotWithinInterval(slot, interval));
