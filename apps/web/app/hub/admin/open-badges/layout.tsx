import type { ReactNode } from 'react';
import { getThemeSectionClassName, ThemeSection } from '@repo/ui/theme';

type AdminOpenBadgesLayoutProps = {
  children: ReactNode;
};

export default function AdminOpenBadgesLayout({ children }: AdminOpenBadgesLayoutProps) {
  return <div className={getThemeSectionClassName(ThemeSection.OpenBadge)}>{children}</div>;
}
