'use client';

import React from 'react';
import { GlobalStyles } from '@mui/material';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import { themeSectionClassPrefix, ThemeSection, sectionPalettes, theme } from '@repo/ui/theme';

type ProvidersProps = {
  children: React.ReactNode;
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

export default function Providers({ children }: ProvidersProps) {
  return (
    <AppRouterCacheProvider options={{ key: 'mui', prepend: true }}>
      <ThemeProvider theme={theme} defaultMode="light">
        <GlobalStyles styles={sectionThemeStyles} />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
