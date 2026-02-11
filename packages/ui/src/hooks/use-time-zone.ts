import { useTimeZone as useIntlTimeZone } from 'next-intl';

export const DEFAULT_TIME_ZONE = 'Europe/Paris';

const useTimeZone = () => useIntlTimeZone() ?? DEFAULT_TIME_ZONE;

export default useTimeZone;
