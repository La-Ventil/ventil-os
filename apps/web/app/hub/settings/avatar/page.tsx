import type { JSX } from 'react';
import { getTranslations } from 'next-intl/server';
import SectionTitle from '@repo/ui/section-title';
import AvatarEditor from '@repo/ui/avatar-editor';

export default async function Page(): Promise<JSX.Element> {
  const t = await getTranslations('pages.hub.avatarSettings');

  return (
    <>
      <SectionTitle>{t('title')}</SectionTitle>
      <AvatarEditor />
    </>
  );
}
