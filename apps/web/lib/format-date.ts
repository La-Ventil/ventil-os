export type DateLocale = string;

export type DateFormatOptions = Omit<Intl.DateTimeFormatOptions, 'timeStyle' | 'dateStyle'>;

const BASE_SHORT_DATE_TIME_OPTIONS: Intl.DateTimeFormatOptions = {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
};

export const formatShortDateTime = (value: Date | string, locale: DateLocale, timeZone?: string): string =>
  new Intl.DateTimeFormat(
    locale,
    timeZone ? { ...BASE_SHORT_DATE_TIME_OPTIONS, timeZone } : BASE_SHORT_DATE_TIME_OPTIONS
  ).format(new Date(value));
