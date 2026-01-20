'use client';

import { useTranslations } from 'next-intl';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ResetPasswordForm from '@repo/ui/forms/reset-password.form';
import { resetPassword } from '../../../lib/actions/reset-password';

export default function Page() {
  const t = useTranslations('pages.public.forgotPassword');

  return (
    <Box>
      <Stack spacing={2}>
        <Typography variant="h2">{t('title')}</Typography>
        <Typography variant="body1">{t('intro')}</Typography>
      </Stack>
      <ResetPasswordForm handleSubmit={resetPassword} />
    </Box>
  );
}
