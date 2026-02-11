'use client';

import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import type { DateTimePickerProps } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useLocale } from 'next-intl';
import useTimeZone from '../../hooks/use-time-zone';

type LocalizedDateTimePickerProps = Omit<DateTimePickerProps, 'format' | 'timezone'> & {
  timezone?: string;
};

const LocalizedDateTimePicker = ({ timezone, ...props }: LocalizedDateTimePickerProps) => {
  const locale = useLocale();
  const resolvedTimeZone = useTimeZone();
  const timeZone = timezone ?? resolvedTimeZone;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={locale}>
      <DateTimePicker {...props} timezone={timeZone} />
    </LocalizationProvider>
  );
};

export default LocalizedDateTimePicker;
