import type { ReactNode } from 'react';
import { getThemeSectionClassName, ThemeSection } from '@repo/ui/theme';
import ScopedIntlClientProvider from '../../../../i18n/scoped-intl-client-provider';

type AdminMachinesLayoutProps = {
  children: ReactNode;
};

export default function AdminMachinesLayout({ children }: AdminMachinesLayoutProps) {
  return (
    <div className={getThemeSectionClassName(ThemeSection.FabLab)}>
      <ScopedIntlClientProvider
        paths={[
          'common',
          'forms',
          'pages.hub.admin.machineForm',
          'pages.hub.admin.machinesEdit.actions.save',
          'validation'
        ]}
      >
        {children}
      </ScopedIntlClientProvider>
    </div>
  );
}
