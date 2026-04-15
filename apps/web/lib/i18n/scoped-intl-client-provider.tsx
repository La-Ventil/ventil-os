import type { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages, getTimeZone } from 'next-intl/server';
import { pickMessages } from './pick-messages';

type ScopedIntlClientProviderProps = {
  children: ReactNode;
  paths: string[];
};

export default async function ScopedIntlClientProvider({
  children,
  paths
}: ScopedIntlClientProviderProps): Promise<ReactNode> {
  const [locale, messages, timeZone] = await Promise.all([getLocale(), getMessages(), getTimeZone()]);

  return (
    <NextIntlClientProvider locale={locale} messages={pickMessages(messages, paths)} timeZone={timeZone}>
      {children}
    </NextIntlClientProvider>
  );
}
