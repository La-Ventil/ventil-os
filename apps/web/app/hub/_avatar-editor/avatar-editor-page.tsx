import type { JSX } from 'react';
import SectionTitle from '@repo/ui/section-title';
import AvatarEditor from '@repo/ui/avatar-editor';
import { getTranslations } from 'next-intl/server';
import { getUserProfileFromSession } from '../../../lib/auth';
import { updateAvatarAction } from '../../../lib/actions/users/update-avatar';

type AvatarEditorPageProps = {
  backHref?: string;
};

export default async function AvatarEditorPage({ backHref }: AvatarEditorPageProps = {}): Promise<JSX.Element> {
  const t = await getTranslations('pages.hub.avatarSettings');
  const userProfile = await getUserProfileFromSession();

  return (
    <>
      <SectionTitle>{t('title')}</SectionTitle>
      <AvatarEditor initialSelection={userProfile.avatar} onSave={updateAvatarAction} />
    </>
  );
}
