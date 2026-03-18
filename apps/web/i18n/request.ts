import { getRequestConfig } from 'next-intl/server';

type Messages = Record<string, unknown>;

const referenceLocale = 'en';

const isObject = (value: unknown): value is Messages =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const mergeMessages = (base: Messages, overrides: Messages): Messages => {
  const merged: Messages = { ...base };

  for (const [key, value] of Object.entries(overrides)) {
    const current = merged[key];
    merged[key] = isObject(current) && isObject(value) ? mergeMessages(current, value) : value;
  }

  return merged;
};

const loadLocaleMessages = async (locale: string): Promise<Messages> => {
  try {
    return (await import(`../messages/${locale}.json`)).default as Messages;
  } catch {
    if (locale === referenceLocale) {
      throw new Error(`Missing reference locale catalog: ${referenceLocale}.json`);
    }

    return {};
  }
};

export default getRequestConfig(async () => {
  const locale = process.env.APP_LOCALE ?? 'fr';
  const timeZone = process.env.APP_TIME_ZONE ?? 'Europe/Paris';
  const referenceMessages = await loadLocaleMessages(referenceLocale);
  const localeMessages = locale === referenceLocale ? {} : await loadLocaleMessages(locale);

  return {
    locale,
    messages: mergeMessages(referenceMessages, localeMessages),
    timeZone
  };
});
