import type { JSX } from 'react';
import { getTranslations } from 'next-intl/server';
import ModalLoadingShell from '@repo/ui/modal-loading-shell';
import { ThemeSection } from '@repo/ui/theme';

export default async function AdminOpenBadgesModalLoading(): Promise<JSX.Element> {
  const t = await getTranslations('pages.hub.admin.openBadges.assignModal');

  return (
    <ModalLoadingShell
      closeLabel={t('cancel')}
      themeSection={ThemeSection.OpenBadge}
      showMedia={false}
      sectionCount={3}
      showActions
    />
  );
}
