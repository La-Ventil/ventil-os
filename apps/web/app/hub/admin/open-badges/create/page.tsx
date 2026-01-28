import { getTranslations } from 'next-intl/server';
import SectionTitle from '@repo/ui/section-title';
import OpenBadgeCreateForm from '@repo/ui/forms/open-badge-create.form';

export default async function AdminOpenBadgeCreatePage() {
  const t = await getTranslations('pages.hub.admin.openBadgesCreate');

  return (
    <>
      <SectionTitle>{t('title')}</SectionTitle>
      <OpenBadgeCreateForm />
    </>
  );
}
