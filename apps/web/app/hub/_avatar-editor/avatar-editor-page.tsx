import type { JSX } from 'react';
import SectionTitle from '@repo/ui/section-title';
import AvatarEditor from '@repo/ui/avatar-editor';
import { getTranslations } from 'next-intl/server';
import { getAvatarOptionPreviewPublicPath } from '@repo/avatar-system';
import { getUserProfileFromSession } from '../../../lib/auth';
import { updateAvatarAction } from '../../../lib/actions/users/update-avatar';

export default async function AvatarEditorPage(): Promise<JSX.Element> {
  const t = await getTranslations('pages.hub.avatarSettings');
  const userProfile = await getUserProfileFromSession();

  return (
    <>
      <SectionTitle>{t('title')}</SectionTitle>
      <AvatarEditor
        initialSelection={userProfile.avatar}
        onSave={updateAvatarAction}
        resolveOptionPreviewSrc={(categoryId, optionId) =>
          getAvatarOptionPreviewPublicPath(categoryId, optionId, '/avatar-previews')
        }
      />
    </>
  );
}
