import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async () => {
  const locale = process.env.APP_LOCALE ?? 'fr';
  const timeZone = process.env.APP_TIME_ZONE ?? 'Europe/Paris';

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
    timeZone
  };
});
