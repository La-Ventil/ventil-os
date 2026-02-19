import type { ReactNode } from 'react';
import { getThemeSectionClassName, ThemeSection } from '@repo/ui/theme';

type AdminOpenBadgesLayoutProps = {
  children: ReactNode;
  modal?: ReactNode;
};

export default function AdminOpenBadgesLayout({ children, modal }: AdminOpenBadgesLayoutProps) {
  return (
    <div className={getThemeSectionClassName(ThemeSection.OpenBadge)}>
      {children}
      {modal}
    </div>
  );
}
