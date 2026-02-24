import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import SectionTitle from '@repo/ui/section-title';
import { viewOpenBadgeEdit } from '@repo/application/open-badges/usecases';
import OpenBadgeEditFormClient from './open-badge-edit-form.client';

type AdminOpenBadgeEditPageProps = {
  params: Promise<{ badgeId: string }>;
};

export default async function AdminOpenBadgeEditPage({ params }: AdminOpenBadgeEditPageProps) {
  const t = await getTranslations('pages.hub.admin.openBadgesEdit');
  const { badgeId } = await params;
  if (!badgeId) {
    notFound();
  }
  const badge = await viewOpenBadgeEdit(badgeId);

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
