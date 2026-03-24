'use client';

import type { JSX } from 'react';
import { useTranslations } from 'next-intl';
import ModalLayout from '@repo/ui/modal-layout';
import SectionTitle from '@repo/ui/section-title';
import { useRouteModal } from '@repo/ui/hooks/use-route-modal';
import { ThemeSection } from '@repo/ui/theme';
import AvatarEditor from '@repo/ui/avatar-editor';

type AvatarEditorModalRouteProps = {
  modalPath: string;
  closeHref: string;
};

export default function AvatarEditorModalRoute({ modalPath, closeHref }: AvatarEditorModalRouteProps): JSX.Element {
  const t = useTranslations('pages.hub.avatarSettings');
  const tCommon = useTranslations('common');
  const { open, handleClose } = useRouteModal({
    modalPath,
    closeHref
  });

  return (
    <ModalLayout
      open={open}
      onClose={handleClose}
      closeLabel={tCommon('actions.back')}
      fullWidth
      maxWidth="sm"
      themeSection={ThemeSection.User}
    >
      <SectionTitle>{t('title')}</SectionTitle>
      <AvatarEditor onBack={handleClose} />
    </ModalLayout>
  );
}
