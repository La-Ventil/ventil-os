import type { ConfigType } from 'dayjs';
import dayjs from '@repo/application/dayjs';

export const toZonedDayjs = (value: ConfigType, timeZone: string) => dayjs(value).tz(timeZone);
