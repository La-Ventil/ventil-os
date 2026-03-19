import UserOpenBadgeAssignModalRoute from '../../user-open-badge-assign-modal-route';
import { getUserOpenBadgeManagementPageData } from '../../open-badge-management-page-data';

type AdminUserOpenBadgesAssignModalPageProps = {
  params: Promise<{ userId: string }>;
};

export default async function AdminUserOpenBadgesAssignModalPage({ params }: AdminUserOpenBadgesAssignModalPageProps) {
  const { userId } = await params;
  const { user, assignableBadges, userIdsByOpenBadgeIdAndLevel } = await getUserOpenBadgeManagementPageData({
    userId
  });

  return (
    <UserOpenBadgeAssignModalRoute
      user={user}
      assignableBadges={assignableBadges}
      userIdsByOpenBadgeIdAndLevel={userIdsByOpenBadgeIdAndLevel}
      closeHref={`/hub/admin/users/${userId}/open-badges`}
    />
  );
}
