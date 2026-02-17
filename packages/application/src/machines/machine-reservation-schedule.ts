import type { DayKey } from '../time/date-time';
import { addMinutesToDate, parseDayKey } from '../time/date-time';
import { SCHEDULE_END_HOUR, SCHEDULE_START_HOUR } from '@repo/domain/machine/reservation-schedule';
import type { DateInterval } from '@repo/domain/date-interval';

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
