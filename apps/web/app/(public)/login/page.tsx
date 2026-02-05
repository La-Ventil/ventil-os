'use client';

import type { NextPage } from 'next';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LoginForm from '@repo/ui/forms/login.form';
import Link from '@repo/ui/link';

const LoginPage: NextPage = () => {
  const t = useTranslations('pages.public.login');
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === 'authenticated') {
      router.replace('/hub/profile');
    }
  }, [router, status]);

  return (
    <Box>
      <Stack spacing={2}>
        <Typography variant="h2">{t('title')}</Typography>
        <Typography variant="h3">{t('subtitle')}</Typography>
        <Typography variant="body1">{t('intro')}</Typography>
      </Stack>
      <LoginForm />
      <Stack spacing={2}>
        <Link href="/forgot-password">{t('forgotPassword')}</Link>
      </Stack>
    </Box>
  );
};

export default LoginPage;
