import React from 'react';
import { getTranslations } from 'next-intl/server';
import Typography from '@mui/material/Typography';
import { OpenBadgeIcon } from '@repo/ui/icons/open-badge-icon';
import Section from '@repo/ui/section';
import SectionSubtitle from '@repo/ui/section-subtitle';
import SectionTitle from '@repo/ui/section-title';
import { getThemeSectionClassName, ThemeSection } from '@repo/ui/theme';

type LayoutProps = {
  children: React.ReactNode;
};

export default async function Layout({ children }: LayoutProps) {
  const t = await getTranslations('pages.hub.openBadges');

  return (
    <div className={getThemeSectionClassName(ThemeSection.OpenBadge)}>
      <SectionTitle icon={<OpenBadgeIcon color="secondary" />}>{t('title')}</SectionTitle>
      <Section>
        <SectionSubtitle>{t('subtitle')}</SectionSubtitle>
        <Typography variant="body1">{t('intro')}</Typography>
      </Section>
      {children}
    </div>
  );
}
