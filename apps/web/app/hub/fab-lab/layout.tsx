import React from 'react';
import { getThemeSectionClassName, ThemeSection } from '@repo/ui/theme';

type LayoutProps = {
  children: React.ReactNode;
  modal: React.ReactNode;
};

export default function Layout({ children, modal }: LayoutProps) {
  return (
    <div className={getThemeSectionClassName(ThemeSection.FabLab)}>
      {children}
      {modal}
    </div>
  );
}
