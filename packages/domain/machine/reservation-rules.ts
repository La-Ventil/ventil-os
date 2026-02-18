import type { DateInterval } from '../date-interval';

export const assertReservationInterval = (interval: DateInterval, context?: string): void => {
  if (interval.end <= interval.start) {
    const suffix = context ? ` (${context})` : '';
    throw new Error(`Invalid reservation interval: endsAt must be after startsAt${suffix}`);
  }
};

export const reservationWindowFor = (startsAt: Date, durationMinutes: number): DateInterval => ({
  start: startsAt,
  end: new Date(startsAt.getTime() + durationMinutes * 60 * 1000)
});

// Half-open interval overlap: [start, end)
export const intervalsOverlap = (left: DateInterval, right: DateInterval): boolean =>
  left.start < right.end && left.end > right.start;

export const intervalOverlapsAny = (interval: DateInterval, intervals: DateInterval[]): boolean =>
  intervals.some((candidate) => intervalsOverlap(interval, candidate));

export const isReservationSlotInPast = (slot: Date, now: Date = new Date()): boolean => slot.getTime() < now.getTime();
