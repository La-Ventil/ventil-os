import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import BottomNavigation from '@repo/ui/bottom-navigation';
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

  return (
    <>
      <main className={styles.main}>
        {children}
      </main>
      <footer>
        <BottomNavigation />
      </footer>
    </>
  );
}
