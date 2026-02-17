import { redirect } from 'next/navigation';
import { isAdmin } from '@repo/application';
import { getServerSession } from '../../../lib/auth';

export default async function AdminLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();
  const userIsAdmin = isAdmin(session?.user);

  if (!session || !userIsAdmin) {
    redirect('/hub/profile');
  }

  return children;
}
