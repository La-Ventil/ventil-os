import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import QuickActionsMenu from '@repo/ui/quick-actions-menu';
import { canManageBadges, canManageUsers, isAdmin } from '@repo/application';
import { getServerSession } from '../../lib/auth';
import styles from './layout.module.css';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('metadata');
  return {
    title: t('hub.title'),
    description: t('hub.description')
  };
}

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();
  if (!session) {
    redirect('/login');
  }
  const userIsAdmin = isAdmin(session.user);
  const userCanManageUsers = canManageUsers(session.user);
  const userCanManageBadges = canManageBadges(session.user);

  return (
    <>
      <main className={styles.main}>{children}</main>
      <footer>
        <QuickActionsMenu
          user={{ email: session.user?.email, image: session.user?.image }}
          isAdmin={userIsAdmin}
          canManageUsers={userCanManageUsers}
          canManageBadges={userCanManageBadges}
        />
      </footer>
    </>
  );
}
