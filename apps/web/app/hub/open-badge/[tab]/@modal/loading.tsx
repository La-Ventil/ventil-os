import type { JSX } from 'react';
import { getTranslations } from 'next-intl/server';
import ModalLoadingShell from '@repo/ui/modal-loading-shell';
import { ThemeSection } from '@repo/ui/theme';

export default async function OpenBadgeModalLoading(): Promise<JSX.Element> {
  const t = await getTranslations('pages.hub.openBadges.detailsModal');

  return (
    <ModalLoadingShell
      closeLabel={t('closeLabel')}
      themeSection={ThemeSection.OpenBadge}
      showMedia
      sectionCount={2}
      showActions
    />
  );
}
