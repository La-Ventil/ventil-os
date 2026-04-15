'use client';

import { useCallback, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import type { AdminProfileFormInput } from '@repo/application/forms';
import type { FormAction } from '@repo/form/form-action-state';
import type { UserProfile } from '@repo/application/users/models/user-profile';
import AdminUserEditForm from '@repo/ui/forms/admin-user-edit.form';
import ModalLayout from '@repo/ui/modal-layout';
import Section from '@repo/ui/section';
import SectionSubtitle from '@repo/ui/section-subtitle';
import SectionTitle from '@repo/ui/section-title';
import { ThemeSection } from '@repo/ui/theme';
import { useDelayedAction } from '@repo/ui/hooks/use-delayed-action';
import { useRouteModal } from '@repo/ui/hooks/use-route-modal';

type EditUserModalRouteProps = {
  profile: UserProfile;
  userId: string;
  closeHref: string;
  handleSubmit: FormAction<AdminProfileFormInput>;
};

export default function EditUserModalRoute({ profile, userId, closeHref, handleSubmit }: EditUserModalRouteProps) {
  const t = useTranslations('pages.hub.admin.usersEdit');
  const tCommon = useTranslations('common');
  const profilePromise = useMemo(() => Promise.resolve(profile), [profile]);
  const { schedule, cancel } = useDelayedAction();
  const modalPath = `/hub/admin/users/${userId}/edit`;
  const { open, handleClose } = useRouteModal({
    modalPath,
    closeHref,
    refreshOnClose: true,
    onCloseStart: cancel
  });

  const handleSuccess = useCallback(() => {
    schedule(handleClose);
  }, [handleClose, schedule]);

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
      <Section>
        <SectionSubtitle>{t('subtitle')}</SectionSubtitle>
      </Section>
      <Section>
        <AdminUserEditForm
          profilePromise={profilePromise}
          handleSubmit={handleSubmit}
          userId={userId}
          onSuccess={handleSuccess}
        />
      </Section>
    </ModalLayout>
  );
}
