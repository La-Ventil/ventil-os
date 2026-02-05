'use client';

import React from 'react';
import { GlobalStyles } from '@mui/material';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import { NextIntlClientProvider } from 'next-intl';
import type { AbstractIntlMessages } from 'next-intl';
import { themeSectionClassPrefix, ThemeSection, sectionPalettes, theme } from '@repo/ui/theme';

type ProvidersProps = {
  children: React.ReactNode;
  locale: string;
  messages: AbstractIntlMessages;
  timeZone: string;
};

const sectionThemeStyles = Object.fromEntries(
  (Object.values(ThemeSection) as ThemeSection[]).map((section) => [
    `.${themeSectionClassPrefix}${section}`,
    {
      '--mui-palette-secondary-light': sectionPalettes[section].light,
      '--mui-palette-secondary-main': sectionPalettes[section].main,
      '--mui-palette-secondary-dark': sectionPalettes[section].dark,
      '--mui-palette-secondary-contrastText': sectionPalettes[section].contrastText
    }
  ])
);

export default function Providers({ children, locale, messages, timeZone }: ProvidersProps) {
  return (
    <AppRouterCacheProvider options={{ key: 'mui', prepend: true }}>
      <ThemeProvider theme={theme} defaultMode="light">
        <GlobalStyles styles={sectionThemeStyles} />
        <NextIntlClientProvider locale={locale} messages={messages} timeZone={timeZone}>
          {children}
        </NextIntlClientProvider>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
