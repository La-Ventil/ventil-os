import type { ReactNode } from 'react';
import { getThemeSectionClassName, ThemeSection } from '@repo/ui/theme';
import ScopedIntlClientProvider from '../../../../lib/i18n/scoped-intl-client-provider';

type AdminOpenBadgesLayoutProps = {
  children: ReactNode;
  modal?: ReactNode;
};

export default function AdminOpenBadgesLayout({ children, modal }: AdminOpenBadgesLayoutProps) {
  return (
    <div className={getThemeSectionClassName(ThemeSection.OpenBadge)}>
      <ScopedIntlClientProvider
        paths={[
          'common',
          'pages.hub.admin.openBadgeForm',
          'pages.hub.admin.openBadges.assignModal',
          'pages.hub.navigation',
          'validation'
        ]}
      >
        {children}
        {modal}
      </ScopedIntlClientProvider>
    </div>
  );
}
