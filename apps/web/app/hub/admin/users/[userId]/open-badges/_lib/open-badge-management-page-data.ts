import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { canManageUsers } from '@repo/application';
import {
  browseOpenBadges,
  buildOpenBadgeAssignableUsersForFixedUserByBadgeIdAndLevel,
  viewUserOpenBadges
} from '@repo/application/open-badges/usecases';
import { browseUsersAsAdmin } from '@repo/application/users/usecases';
import { getServerSession } from '../../../../../../../lib/auth';

type UserOpenBadgeManagementParams = {
  userId: string;
};

export async function getUserOpenBadgeManagementPageData({ userId }: UserOpenBadgeManagementParams) {
  const session = await getServerSession();
  const userCanManageUsers = canManageUsers(session?.user);

  if (!session || !userCanManageUsers) {
    redirect('/hub/profile');
  }

  const [users, badges, allAssignableBadges, t] = await Promise.all([
    browseUsersAsAdmin(),
    viewUserOpenBadges(userId, { includeInactive: true }),
    browseOpenBadges(userId),
    getTranslations('pages.hub.admin.users.badgeManagement')
  ]);
  const user = users.find((entry) => entry.id === userId);

  if (!user) {
    redirect('/hub/admin/users');
  }

  const assignableBadges = allAssignableBadges.filter((badge) =>
    badge.levels.some((level) => level.level > badge.activeLevel)
  );
  const userIdsByOpenBadgeIdAndLevel = await buildOpenBadgeAssignableUsersForFixedUserByBadgeIdAndLevel(
    assignableBadges,
    userId
  );

  return {
    t,
    user,
    badges,
    assignableBadges,
    userIdsByOpenBadgeIdAndLevel
  };
}
