import React from 'react';
import { getThemeSectionClassName, ThemeSection } from '@repo/ui/theme';
import ScopedIntlClientProvider from '../../../i18n/scoped-intl-client-provider';

type LayoutProps = {
  children: React.ReactNode;
  modal?: React.ReactNode;
};

export default function Layout({ children, modal }: LayoutProps) {
  return (
    <div className={getThemeSectionClassName(ThemeSection.User)}>
      <ScopedIntlClientProvider paths={['common', 'pages.hub.avatarSettings', 'pages.hub.avatarSettings.editor']}>
        {children}
        {modal}
      </ScopedIntlClientProvider>
    </div>
  );
}
