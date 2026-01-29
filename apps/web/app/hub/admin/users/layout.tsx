import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { canManageUsersUser } from '@repo/application';
import { getServerSession } from '../../../../lib/auth';

type AdminUsersLayoutProps = {
  children: ReactNode;
  modal: ReactNode;
};

export default async function AdminUsersLayout({ children, modal }: AdminUsersLayoutProps) {
  const session = await getServerSession();
  const canManageUsers = canManageUsersUser(session?.user);

  if (!session || !canManageUsers) {
    redirect('/hub/profile');
  }

  return (
    <>
      {children}
      {modal}
    </>
  );
}
