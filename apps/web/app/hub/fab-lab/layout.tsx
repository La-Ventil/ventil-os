import React from 'react';
import { getThemeSectionClassName, ThemeSection } from '@repo/ui/theme';
import ScopedIntlClientProvider from '../../../i18n/scoped-intl-client-provider';

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div className={getThemeSectionClassName(ThemeSection.FabLab)}>
      <ScopedIntlClientProvider paths={['common', 'forms', 'pages.hub.fabLab', 'pages.hub.navigation', 'validation']}>
        {children}
      </ScopedIntlClientProvider>
    </div>
  );
}
