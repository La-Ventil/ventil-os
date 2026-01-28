import { redirect } from 'next/navigation';
import { getServerSession } from '../../../lib/auth';

export default async function AdminLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();
  const isAdmin = Boolean(session?.user?.globalAdmin || session?.user?.pedagogicalAdmin);

  if (!session || !isAdmin) {
    redirect('/hub/profile');
  }

  return children;
}
