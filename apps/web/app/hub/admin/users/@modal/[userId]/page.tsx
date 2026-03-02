import type { JSX } from 'react';
import { browseUsersAsAdmin } from '@repo/application/users/usecases';
import { browseOpenBadges } from '@repo/application/open-badges/usecases';
import AssignOpenBadgeModalRoute from '../../assign-open-badge-modal-route';
import type { UserSummaryWithOpenBadgeLevelViewModel } from '@repo/view-models/user-summary';

type AdminUsersModalPageProps = {
  params: Promise<{ userId: string }>;
};

export default async function AdminUsersModalPage({
  params
}: AdminUsersModalPageProps): Promise<JSX.Element | null> {
  const { userId } = await params;
  const users = await browseUsersAsAdmin();
  const openBadges = await browseOpenBadges();
  const user = users.find((entry) => entry.id === userId) ?? null;

  if (!user) {
    return null;
  }

  const toUserSummary = (entry: (typeof users)[number]): UserSummaryWithOpenBadgeLevelViewModel => ({
    id: entry.id,
    firstName: entry.firstName,
    lastName: entry.lastName,
    username: entry.username,
    image: entry.image,
    email: entry.email,
    fullName: entry.fullName,
    currentOpenBadgeLevel: null
  });

  const userOptions = users.map(toUserSummary);

  return (
    <AssignOpenBadgeModalRoute
      user={user ? toUserSummary(user) : null}
      users={userOptions}
      openBadges={openBadges}
      translationNamespace="pages.hub.admin.users.assignModal"
      closeHref="/hub/admin/users"
    />
  );
}
