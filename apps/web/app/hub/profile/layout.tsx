import React from 'react';
import { ThemeSection } from '@repo/ui/theme';

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return <div className={`sectionTheme-${ThemeSection.User}`}>{children}</div>;
}
