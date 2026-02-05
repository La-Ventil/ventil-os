import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LoginForm from '@repo/ui/forms/login.form';
import Link from '@repo/ui/link';
import { getServerSession } from '../../../lib/auth';

const LoginPage = async () => {
  const session = await getServerSession();
  if (session) {
    redirect('/hub/profile');
  }
  const t = await getTranslations('pages.public.login');

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
