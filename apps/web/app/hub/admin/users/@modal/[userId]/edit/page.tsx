import { redirect } from 'next/navigation';
import { canManageUsers } from '@repo/application';
import { viewUserProfileById } from '@repo/application/users/usecases';
import EditUserModalRoute from '../../../edit-user-modal-route';
import { updateAdminUserProfileAction } from '../../../../../../../lib/actions/update-admin-user-profile';
import { getServerSession } from '../../../../../../../lib/auth';

type AdminUsersEditModalPageProps = {
  params: Promise<{ userId: string }>;
};

export default async function AdminUsersEditModalPage({
  params
}: AdminUsersEditModalPageProps) {
  const session = await getServerSession();
  const userCanManageUsers = canManageUsers(session?.user);

  if (!session || !userCanManageUsers) {
    redirect('/hub/profile');
  }

  const { userId } = await params;
  const profile = await viewUserProfileById(userId);
  if (!profile) {
    return null;
  }

  return (
    <EditUserModalRoute
      profile={profile}
      userId={userId}
      closeHref="/hub/admin/users"
      handleSubmit={updateAdminUserProfileAction}
    />
  );
}
