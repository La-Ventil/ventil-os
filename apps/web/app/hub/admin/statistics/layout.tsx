import type { ReactNode } from 'react';
import { getThemeSectionClassName, ThemeSection } from '@repo/ui/theme';

type AdminStatisticsLayoutProps = {
  children: ReactNode;
};

export default function AdminStatisticsLayout({ children }: AdminStatisticsLayoutProps) {
  return <div className={getThemeSectionClassName(ThemeSection.User)}>{children}</div>;
}
