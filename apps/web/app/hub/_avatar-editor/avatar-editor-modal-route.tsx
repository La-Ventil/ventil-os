'use client';

import type { JSX } from 'react';
import { useTranslations } from 'next-intl';
import ModalLayout from '@repo/ui/modal-layout';
import SectionTitle from '@repo/ui/section-title';
import { useRouteModal } from '@repo/ui/hooks/use-route-modal';
import { ThemeSection } from '@repo/ui/theme';
import AvatarEditor from '@repo/ui/avatar-editor';
import type { AvatarSelection } from '@repo/avatar-system';

type AvatarEditorModalRouteProps = {
  initialSelection: AvatarSelection;
  modalPath: string;
  closeHref: string;
  onSave: (selection: AvatarSelection) => Promise<AvatarSelection | void>;
};

export default function AvatarEditorModalRoute({
  initialSelection,
  modalPath,
  closeHref,
  onSave
}: AvatarEditorModalRouteProps): JSX.Element {
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
      <AvatarEditor
        initialSelection={initialSelection}
        onBack={handleClose}
        onSave={onSave}
        onSaved={handleClose}
        optionPreviewBasePath="/avatar-previews"
      />
    </ModalLayout>
  );
}
