import type { ConfigType } from 'dayjs';
import dayjs from '@repo/application/time/dayjs';

export const toZonedDayjs = (value: ConfigType, timeZone: string) => dayjs(value).tz(timeZone);
