'use client';

import { useCallback, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import type { AdminProfileFormInput } from '@repo/application/forms';
import type { FormAction } from '@repo/form/form-action-state';
import type { UserProfile } from '@repo/view-models/user-profile';
import AdminUserEditForm from '@repo/ui/forms/admin-user-edit.form';
import ModalLayout from '@repo/ui/modal-layout';
import Section from '@repo/ui/section';
import SectionSubtitle from '@repo/ui/section-subtitle';
import SectionTitle from '@repo/ui/section-title';
import { ThemeSection } from '@repo/ui/theme';
import { useDelayedAction } from '../../../../lib/hooks/use-delayed-action';

type EditUserModalRouteProps = {
  profile: UserProfile;
  userId: string;
  closeHref: string;
  handleSubmit: FormAction<AdminProfileFormInput>;
};

export default function EditUserModalRoute({
  profile,
  userId,
  closeHref,
  handleSubmit
}: EditUserModalRouteProps) {
  const router = useRouter();
  const t = useTranslations('pages.hub.admin.usersEdit');
  const tCommon = useTranslations('common');
  const [isOpen, setIsOpen] = useState(true);
  const profilePromise = useMemo(() => Promise.resolve(profile), [profile]);
  const { schedule, cancel } = useDelayedAction();

  const handleClose = useCallback(() => {
    cancel();
    setIsOpen(false);
    router.push(closeHref);
    router.refresh();
  }, [cancel, closeHref, router]);

  const handleSuccess = useCallback(() => {
    schedule(handleClose);
  }, [handleClose, schedule]);

  return (
    <ModalLayout
      open={isOpen}
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
