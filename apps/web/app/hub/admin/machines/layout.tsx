import type { ReactNode } from 'react';
import { getThemeSectionClassName, ThemeSection } from '@repo/ui/theme';

type AdminMachinesLayoutProps = {
  children: ReactNode;
};

export default function AdminMachinesLayout({ children }: AdminMachinesLayoutProps) {
  return <div className={getThemeSectionClassName(ThemeSection.FabLab)}>{children}</div>;
}
