import type { JSX } from 'react';
import { getTranslations } from 'next-intl/server';
import Typography from '@mui/material/Typography';
import Section from '@repo/ui/section';
import SectionSubtitle from '@repo/ui/section-subtitle';
import SectionTitle from '@repo/ui/section-title';
import AvatarEditorDraft from './avatar-editor-draft';

export default async function Page(): Promise<JSX.Element> {
  const t = await getTranslations('pages.hub.avatarSettings');

  return (
    <>
      <SectionTitle>{t('title')}</SectionTitle>
      <Section>
        <SectionSubtitle>{t('subtitle')}</SectionSubtitle>
        <Typography variant="body1">{t('intro')}</Typography>
      </Section>
      <AvatarEditorDraft />
    </>
  );
}
