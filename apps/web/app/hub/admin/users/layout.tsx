import type { ReactNode } from 'react';
import { getThemeSectionClassName, ThemeSection } from '@repo/ui/theme';

type AdminUsersLayoutProps = {
  children: ReactNode;
  modal?: ReactNode;
};

export default function AdminUsersLayout({ children, modal }: AdminUsersLayoutProps) {
  return (
    <div className={getThemeSectionClassName(ThemeSection.User)}>
      {children}
      {modal}
    </div>
  );
}
