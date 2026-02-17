import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { canManageUsers } from '@repo/application';
import { getServerSession } from '../../../../lib/auth';

type AdminUsersLayoutProps = {
  children: ReactNode;
  modal: ReactNode;
};

export default async function AdminUsersLayout({ children, modal }: AdminUsersLayoutProps) {
  const session = await getServerSession();
  const canManageUsersForUser = canManageUsers(session?.user);

  if (!session || !canManageUsersForUser) {
    redirect('/hub/profile');
  }

  return (
    <>
      {children}
      {modal}
    </>
  );
}
