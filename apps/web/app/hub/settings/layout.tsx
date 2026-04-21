import React from 'react';
import { getThemeSectionClassName, ThemeSection } from '@repo/ui/theme';
import ScopedIntlClientProvider from '../../../i18n/scoped-intl-client-provider';

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div className={getThemeSectionClassName(ThemeSection.User)}>
      <ScopedIntlClientProvider
        paths={[
          'common',
          'educationLevel',
          'forms',
          'pages.hub.avatarSettings.editor',
          'profileSelector',
          'validation'
        ]}
      >
        {children}
      </ScopedIntlClientProvider>
    </div>
  );
}
