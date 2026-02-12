'use server';

import type { JSX } from 'react';
import { getTranslations } from 'next-intl/server';
import Alert from '@mui/material/Alert';
import { verifyEmailToken } from '@repo/application';
import { getServerSession } from '../../../../lib/auth';
import AutoRedirect from '@repo/ui/auto-redirect';

type VerifyEmailPageProps = {
  params: Promise<{
    token: string;
  }>;
  searchParams: Promise<{
    email?: string;
  }>;
};

export default async function Page({ params, searchParams }: VerifyEmailPageProps): Promise<JSX.Element> {
  const t = await getTranslations('pages.public.verifyEmail');
  const [{ token }, { email }] = await Promise.all([params, searchParams]);

  if (!token) {
    return <Alert severity="error">{t('missingToken')}</Alert>;
  }

  if (!email) {
    return <Alert severity="error">{t('missingEmail')}</Alert>;
  }

  const result = await verifyEmailToken(email, token);

  if (result.ok) {
    const session = await getServerSession();
    const redirectTo =
      session?.user?.email === email
        ? '/hub/profile'
        : `/login?email=${encodeURIComponent(email)}&reason=verified`;
    return (
      <>
        <Alert severity="success">{t('success')}</Alert>
        <AutoRedirect
          redirectLabel={t('continue')}
          redirectingLabel={t('redirecting')}
          redirectTo={redirectTo}
        />
      </>
    );
  }

  const message = (() => {
    switch (result.reason) {
      case 'expired':
        return t('expired');
      case 'not-found':
        return t('notFound');
      default:
        return t('invalid');
    }
  })();

  return <Alert severity={result.ok ? 'success' : 'error'}>{message}</Alert>;
}
