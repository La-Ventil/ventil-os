'use client';

import type { NextPage } from 'next';
import { useTranslations } from 'next-intl';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ConnexionForm from '@repo/ui/forms/connexion.form';
import Link from '@repo/ui/link';

const Signin: NextPage = () => {
  const t = useTranslations('pages.public.connexion');

  return (
    <Box>
      <Stack spacing={2}>
        <Typography variant="h2">{t('title')}</Typography>
        <Typography variant="h3">{t('subtitle')}</Typography>
        <Typography variant="body1">{t('intro')}</Typography>
      </Stack>
      <ConnexionForm />
      <Stack spacing={2}>
        <Link href="/mot-de-passe-oublie">{t('forgotPassword')}</Link>
      </Stack>
    </Box>
  );
};

export default Signin;
