'use client';

import React from 'react';
import { CssVarsProvider, GlobalStyles } from '@mui/material';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter';
import { NextIntlClientProvider } from 'next-intl';
import type { AbstractIntlMessages } from 'next-intl';
import { ThemeSection, sectionPalettes, theme } from '@repo/ui/theme';

type ProvidersProps = {
  children: React.ReactNode;
  locale: string;
  messages: AbstractIntlMessages;
};

const sectionThemeStyles = Object.fromEntries(
  (Object.values(ThemeSection) as ThemeSection[]).map((section) => [
    `.sectionTheme-${section}`,
    {
      '--mui-palette-secondary-light': sectionPalettes[section].light,
      '--mui-palette-secondary-main': sectionPalettes[section].main,
      '--mui-palette-secondary-dark': sectionPalettes[section].dark,
      '--mui-palette-secondary-contrastText': sectionPalettes[section].contrastText
    }
  ])
);

export default function Providers({ children, locale, messages }: ProvidersProps) {
  return (
    <AppRouterCacheProvider options={{ key: 'mui', prepend: true }}>
      <CssVarsProvider theme={theme} defaultMode="light">
        <GlobalStyles styles={sectionThemeStyles} />
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </CssVarsProvider>
    </AppRouterCacheProvider>
  );
}
