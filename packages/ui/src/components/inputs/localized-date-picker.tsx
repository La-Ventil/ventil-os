'use client';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import type { DatePickerProps } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useLocale } from 'next-intl';
import useTimeZone from '../../hooks/use-time-zone';

type LocalizedDatePickerProps = Omit<DatePickerProps, 'format' | 'timezone'> & {
  timezone?: string;
};

const LocalizedDatePicker = ({ timezone, ...props }: LocalizedDatePickerProps) => {
  const locale = useLocale();
  const resolvedTimeZone = useTimeZone();
  const timeZone = timezone ?? resolvedTimeZone;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={locale}>
      <DatePicker {...props} timezone={timeZone} />
    </LocalizationProvider>
  );
};

export default LocalizedDatePicker;
