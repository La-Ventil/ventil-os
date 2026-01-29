import React from 'react';
import { getThemeSectionClassName, ThemeSection } from '@repo/ui/theme';

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return <div className={getThemeSectionClassName(ThemeSection.FabLab)}>{children}</div>;
}
