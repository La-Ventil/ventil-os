import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import QuickActionsMenu from '@repo/ui/quick-actions-menu';
import { canManageBadgesUser, canManageUsersUser, isAdminUser } from '@repo/application';
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
  const isAdmin = isAdminUser(session.user);
  const canManageUsers = canManageUsersUser(session.user);
  const canManageBadges = canManageBadgesUser(session.user);

  return (
    <>
      <main className={styles.main}>{children}</main>
      <footer>
        <QuickActionsMenu isAdmin={isAdmin} canManageUsers={canManageUsers} canManageBadges={canManageBadges} />
      </footer>
    </>
  );
}
