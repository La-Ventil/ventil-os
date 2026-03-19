import Typography from '@mui/material/Typography';
import Section from '@repo/ui/section';
import SectionSubtitle from '@repo/ui/section-subtitle';
import SectionTitle from '@repo/ui/section-title';
import UserOpenBadgeManagement from './user-open-badge-management';
import { getUserOpenBadgeManagementPageData } from './open-badge-management-page-data';

type AdminUserOpenBadgesPageProps = {
  params: Promise<{ userId: string }>;
};

export const dynamic = 'force-dynamic';

export default async function AdminUserOpenBadgesPage({ params }: AdminUserOpenBadgesPageProps) {
  const { userId } = await params;
  const { t, user, badges, assignableBadges } = await getUserOpenBadgeManagementPageData({ userId });

  return (
    <>
      <SectionTitle>{t('title', { name: user.fullName })}</SectionTitle>
      <Section>
        <SectionSubtitle>{t('subtitle')}</SectionSubtitle>
        <Typography variant="body1">{t('intro', { name: user.fullName })}</Typography>
      </Section>

      <UserOpenBadgeManagement
        user={user}
        badges={badges}
        assignableBadges={assignableBadges}
        labels={{
          actions: {
            assign: t('actions.assign'),
            manage: t('actions.manage'),
            upgrade: t('actions.upgrade'),
            downgrade: t('actions.downgrade'),
            remove: t('actions.remove')
          },
          columns: {
            actions: t('columns.actions'),
            image: t('columns.image'),
            badge: t('columns.badge'),
            level: t('columns.level')
          },
          empty: {
            title: t('empty.title'),
            description: t('empty.description')
          },
          feedback: {
            genericError: t('feedback.genericError')
          }
        }}
      />
    </>
  );
}
