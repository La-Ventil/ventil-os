import type { ReactNode } from 'react';
import { getThemeSectionClassName, ThemeSection } from '@repo/ui/theme';

type AdminUsersLayoutProps = {
  children: ReactNode;
};

export default function AdminUsersLayout({ children }: AdminUsersLayoutProps) {
  return <div className={getThemeSectionClassName(ThemeSection.User)}>{children}</div>;
}
