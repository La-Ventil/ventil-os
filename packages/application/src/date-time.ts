import type { ConfigType, Dayjs } from 'dayjs';
import dayjs from './dayjs';

export const DAY_KEY_FORMAT = 'YYYY-MM-DD';
export type DayKey = string & { readonly __brand: 'DayKey' };

const toZonedDayjs = (value: ConfigType, timeZone: string) => dayjs(value).tz(timeZone);

export const formatDayKey = (value: ConfigType, timeZone: string): DayKey =>
  toZonedDayjs(value, timeZone).format(DAY_KEY_FORMAT) as DayKey;

type DayjsTzStrictParser = (value: string, format: string, timeZone: string, strict?: boolean) => Dayjs;

const parseDayKeyDayjsStrict = (dayKey: DayKey, timeZone: string) => {
  const parsed = (dayjs as typeof dayjs & { tz: DayjsTzStrictParser }).tz(
    dayKey,
    DAY_KEY_FORMAT,
    timeZone,
    true
  );
  if (!parsed.isValid()) {
    throw new Error(`Invalid day key: ${dayKey}`);
  }
  return parsed.startOf('day');
};

export const parseDayKey = (dayKey: DayKey, timeZone: string): Date =>
  parseDayKeyDayjsStrict(dayKey, timeZone).toDate();

export const tryParseDayKey = (dayKey: string): DayKey | null => {
  const parsed = dayjs(dayKey, DAY_KEY_FORMAT, true);
  return parsed.isValid() ? (dayKey as DayKey) : null;
};

export const resolveDayKeyFromString = (value: string | null | undefined): DayKey | null =>
  value ? tryParseDayKey(value) : null;

export const getDayIntervalForDayKey = (dayKey: DayKey, timeZone: string) => {
  const start = parseDayKeyDayjsStrict(dayKey, timeZone);
  return { start: start.toDate(), end: start.add(1, 'day').toDate() };
};

export const addMinutesToDate = (date: Date, minutes: number): Date => dayjs(date).add(minutes, 'minute').toDate();
export const differenceInMinutes = (left: Date, right: Date): number => dayjs(left).diff(right, 'minute');
