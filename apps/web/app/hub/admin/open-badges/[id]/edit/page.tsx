import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import SectionTitle from '@repo/ui/section-title';
import { getOpenBadgeEditData } from '@repo/application';
import OpenBadgeEditFormClient from './open-badge-edit-form.client';

type AdminOpenBadgeEditPageProps = {
  params: { id: string };
};

export default async function AdminOpenBadgeEditPage({ params }: AdminOpenBadgeEditPageProps) {
  const t = await getTranslations('pages.hub.admin.openBadgesCreate');
  const badge = await getOpenBadgeEditData(params.id);

  if (!badge) {
    notFound();
  }

  return (
    <>
      <SectionTitle>{t('title')}</SectionTitle>
      <OpenBadgeEditFormClient
        badge={{
          id: badge.id,
          name: badge.name,
          description: badge.description,
          coverImage: badge.coverImage ?? null,
          levels: badge.levels.map((level) => ({
            title: level.title,
            description: level.description ?? ''
          })),
          activationEnabled: badge.activationEnabled
        }}
      />
    </>
  );
}
