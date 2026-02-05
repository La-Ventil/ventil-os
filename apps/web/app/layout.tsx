import React from 'react';
import type { Metadata, Viewport } from 'next';
import { getLocale, getMessages, getTimeZone, getTranslations } from 'next-intl/server';
import { nunito, vg5000 } from '@repo/ui/fonts';
import Providers from './providers';
import './globals.css';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('metadata');
  const appName = process.env.APP_NAME ?? 'La-Ventil';
  const baseUrl = process.env.BASE_URL ?? 'http://localhost:3000';
  const title = t('root.title', { appName });
  const description = t('root.description');
  return {
    metadataBase: new URL(baseUrl),
    title,
    description,
    alternates: {
      canonical: '/'
    },
    openGraph: {
      title,
      description,
      url: '/',
      siteName: appName,
      type: 'website',
      images: [
        {
          url: '/assets/static/cover-v0-1.svg',
          width: 1200,
          height: 630,
          alt: appName
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/assets/static/cover-v0-1.svg']
    },
    icons: {
      icon: '/favicon.ico'
    }
  };
}

export const viewport: Viewport = {
  initialScale: 1,
  width: 'device-width'
};

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();
  const timeZone = await getTimeZone();

  return (
    <html className={`${nunito.variable} ${vg5000.variable}`}>
      <body>
        <Providers locale={locale} messages={messages} timeZone={timeZone}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
