import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { canManageBadges } from '@repo/application';
import { getServerSession } from '../../../../lib/auth';

type AdminOpenBadgesLayoutProps = {
  children: ReactNode;
  modal: ReactNode;
};

export default async function AdminOpenBadgesLayout({ children, modal }: AdminOpenBadgesLayoutProps) {
  const session = await getServerSession();
  const userCanManageBadges = canManageBadges(session?.user);

  if (!session || !userCanManageBadges) {
    redirect('/hub/profile');
  }

  return (
    <>
      {children}
      {modal}
    </>
  );
}
