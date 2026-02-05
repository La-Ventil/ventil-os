import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { canManageBadgesUser } from '@repo/application';
import { getServerSession } from '../../../../lib/auth';

type AdminOpenBadgesLayoutProps = {
  children: ReactNode;
  modal: ReactNode;
};

export default async function AdminOpenBadgesLayout({ children, modal }: AdminOpenBadgesLayoutProps) {
  const session = await getServerSession();
  const canManageBadges = canManageBadgesUser(session?.user);

  if (!session || !canManageBadges) {
    redirect('/hub/profile');
  }

  return (
    <>
      {children}
      {modal}
    </>
  );
}
