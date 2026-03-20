import { getTranslations } from 'next-intl/server';
import ModalLoadingShell from '@repo/ui/modal-loading-shell';
import { ThemeSection } from '@repo/ui/theme';

export default async function Loading() {
  const t = await getTranslations('pages.hub.fabLab');

  return (
    <ModalLoadingShell
      closeLabel={t('modal.closeLabel')}
      themeSection={ThemeSection.FabLab}
      maxWidth="sm"
      fullWidth
      showMedia
      sectionCount={2}
    />
  );
}
