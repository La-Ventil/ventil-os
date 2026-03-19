import type { JSX } from 'react';
import { getTranslations } from 'next-intl/server';
import ModalLoadingShell from '@repo/ui/modal-loading-shell';
import { ThemeSection } from '@repo/ui/theme';

export default async function AdminUsersModalLoading(): Promise<JSX.Element> {
  const t = await getTranslations('common');

  return (
    <ModalLoadingShell
      closeLabel={t('actions.back')}
      themeSection={ThemeSection.User}
      showMedia={false}
      sectionCount={3}
      showActions
    />
  );
}
