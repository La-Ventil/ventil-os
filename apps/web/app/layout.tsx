import React from 'react';
import type { Metadata, Viewport } from 'next';
import { getLocale, getMessages, getTranslations } from 'next-intl/server';
import { nunito, vg5000 } from '@repo/ui/fonts';
import Providers from './providers';
import './globals.css';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('metadata');
  const appName = process.env.APP_NAME ?? 'La-Ventil';
  return {
    title: t('root.title', { appName }),
    description: t('root.description')
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

  return (
    <html className={`${nunito.variable} ${vg5000.variable}`}>
      <body>
        <Providers locale={locale} messages={messages}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
