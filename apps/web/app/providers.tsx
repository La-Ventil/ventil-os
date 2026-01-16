'use client';

import React from 'react';
import { ThemeProvider } from '@mui/material';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter';
import { NextIntlClientProvider } from 'next-intl';
import type { AbstractIntlMessages } from 'next-intl';
import { theme } from '@repo/ui/theme';

type ProvidersProps = {
  children: React.ReactNode;
  locale: string;
  messages: AbstractIntlMessages;
};

export default function Providers({ children, locale, messages }: ProvidersProps) {
  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
