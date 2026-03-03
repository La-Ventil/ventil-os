import { redirect } from 'next/navigation';
import Typography from '@mui/material/Typography';
import { getTranslations } from 'next-intl/server';
import { canManageUsers } from '@repo/application';
import { browseOpenBadges, viewUserOpenBadges } from '@repo/application/open-badges/usecases';
import { browseUsersAsAdmin } from '@repo/application/users/usecases';
import Section from '@repo/ui/section';
import SectionSubtitle from '@repo/ui/section-subtitle';
import SectionTitle from '@repo/ui/section-title';
import UserOpenBadgeManagement from '../user-open-badge-management';
import { getServerSession } from '../../../../../lib/auth';

type AdminUserOpenBadgesPageProps = {
  params: Promise<{ userId: string }>;
};

export const dynamic = 'force-dynamic';

export default async function AdminUserOpenBadgesPage({
  params
}: AdminUserOpenBadgesPageProps) {
  const session = await getServerSession();
  const userCanManageUsers = canManageUsers(session?.user);

  if (!session || !userCanManageUsers) {
    redirect('/hub/profile');
  }

  const { userId } = await params;
  const [users, badges, assignableBadges] = await Promise.all([
    browseUsersAsAdmin(),
    viewUserOpenBadges(userId),
    browseOpenBadges(userId)
  ]);
  const user = users.find((entry) => entry.id === userId);

  if (!user) {
    redirect('/hub/admin/users');
  }

  const t = await getTranslations('pages.hub.admin.users.badgeManagement');

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
        assignableBadges={assignableBadges.filter((badge) =>
          badge.levels.some((level) => level.level > badge.activeLevel)
        )}
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
