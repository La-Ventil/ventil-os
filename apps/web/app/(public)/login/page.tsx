import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LoginForm from '@repo/ui/forms/login.form';
import Link from '@repo/ui/link';
import { getUserProfileByEmail } from '@repo/application';
import { getServerSession } from '../../../lib/auth';

type LoginPageProps = {
  searchParams:
    | Promise<{
        email?: string;
        reason?: string;
      }>
    | {
        email?: string;
        reason?: string;
      };
};

const LoginPage = async ({ searchParams }: LoginPageProps) => {
  const session = await getServerSession();
  if (session?.user?.email) {
    const profile = await getUserProfileByEmail(session.user.email);
    if (profile) {
      redirect('/hub/profile');
    }
  }
  const t = await getTranslations('pages.public.login');
  const resolvedSearchParams = await Promise.resolve(searchParams);
  const email = resolvedSearchParams?.email;
  const reason = resolvedSearchParams?.reason;
  const noticeMessage = reason === 'verified' ? t('emailVerifiedNotice') : undefined;

  return (
    <Box>
      <Stack spacing={2}>
        <Typography variant="h2">{t('title')}</Typography>
        <Typography variant="h3">{t('subtitle')}</Typography>
        <Typography variant="body1">{t('intro')}</Typography>
      </Stack>
      <LoginForm initialEmail={email ?? ''} noticeMessage={noticeMessage} />
      <Stack spacing={2}>
        <Link href="/forgot-password">{t('forgotPassword')}</Link>
      </Stack>
    </Box>
  );
};

export default LoginPage;
