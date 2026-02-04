import type { Metadata } from 'next';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Typography } from '@mui/material';
import Link from '@repo/ui/link';
import { LogoIcon } from '@repo/ui/icons/logo-icon';
import styles from './layout.module.css';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('metadata');
  return {
    title: t('public.title'),
    description: t('public.description')
  };
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Link className={styles.logoGroup} href="/">
        <LogoIcon className={styles.logo} />
        <Typography className={styles.title} variant="h1">
          La-Ventil
        </Typography>
      </Link>
      {children}
    </>
  );
}
