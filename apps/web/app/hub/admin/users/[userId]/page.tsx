import { redirect } from 'next/navigation';

type AdminUserPageProps = {
  params: Promise<{ userId: string }>;
};

export default async function AdminUserPage({ params }: AdminUserPageProps) {
  const { userId } = await params;
  redirect(`/hub/admin/users/${userId}/open-badges`);
}
