import { getTranslations } from 'next-intl/server';
import SectionTitle from '@repo/ui/section-title';
import OpenBadgeCreateFormClient from './open-badge-create-form.client';

export default async function AdminOpenBadgeCreatePage() {
  const t = await getTranslations('pages.hub.admin.openBadgesCreate');

  return (
    <>
      <SectionTitle>{t('title')}</SectionTitle>
      <OpenBadgeCreateFormClient />
    </>
  );
}
