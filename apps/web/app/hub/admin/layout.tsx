import { redirect } from 'next/navigation';
import { isAdminUser } from '@repo/application';
import { getServerSession } from '../../../lib/auth';

export default async function AdminLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();
  const isAdmin = isAdminUser(session?.user);

  if (!session || !isAdmin) {
    redirect('/hub/profile');
  }

  return children;
}
