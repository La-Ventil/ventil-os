import type { ReactNode } from 'react';
import { getTranslations } from 'next-intl/server';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

type VerifyEmailLayoutProps = {
  children: ReactNode;
};

export default async function VerifyEmailLayout({ children }: VerifyEmailLayoutProps) {
  const t = await getTranslations('pages.public.verifyEmail');

  return (
    <Box>
      <Stack spacing={2}>
        <Typography variant="h2">{t('title')}</Typography>
        {children}
      </Stack>
    </Box>
  );
}
