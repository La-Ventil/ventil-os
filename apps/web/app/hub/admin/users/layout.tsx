import type { ReactNode } from 'react';
import { getThemeSectionClassName, ThemeSection } from '@repo/ui/theme';
import ScopedIntlClientProvider from '../../../../i18n/scoped-intl-client-provider';

type AdminUsersLayoutProps = {
  children: ReactNode;
  modal?: ReactNode;
};

export default function AdminUsersLayout({ children, modal }: AdminUsersLayoutProps) {
  return (
    <div className={getThemeSectionClassName(ThemeSection.User)}>
      <ScopedIntlClientProvider
        paths={[
          'common',
          'educationLevel',
          'forms',
          'pages.hub.admin.users.badgeManagement.assignDialog',
          'pages.hub.admin.usersEdit',
          'pages.hub.navigation',
          'profileSelector',
          'validation'
        ]}
      >
        {children}
        {modal}
      </ScopedIntlClientProvider>
    </div>
  );
}
