import type { Metadata } from 'next';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Typography } from '@mui/material';
import Link from '@repo/ui/link';

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
      <Link href="/">
        <Image src="/vercel.svg" alt="Vercel logomark" width={20} height={20} />
        <Typography variant="h1">La-Ventil</Typography>
      </Link>
      {children}
    </>
  );
}
