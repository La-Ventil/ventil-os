import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LoginForm from '@repo/ui/forms/login.form';
import Link from '@repo/ui/link';
import { viewUserProfile } from '@repo/application/users/usecases';
import { getServerSession } from '../../../lib/auth';
import { resendEmailVerificationAction } from '../../../lib/actions/auth/resend-email-verification';
import ScopedIntlClientProvider from '../../../i18n/scoped-intl-client-provider';
import AuthPanel, { authPanelTitleClassName } from '../_components/auth-panel';
import styles from './page.module.css';

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
    const profile = await viewUserProfile(session.user.email);
    if (profile) {
      redirect('/hub/profile');
    }
  }
  const t = await getTranslations('pages.public.login');
  const tVerify = await getTranslations('pages.public.verifyEmail');
  const resolvedSearchParams = await Promise.resolve(searchParams);
  const email = resolvedSearchParams?.email;
  const reason = resolvedSearchParams?.reason;
  const noticeMessage = reason === 'verified' ? t('emailVerifiedNotice') : undefined;

  return (
    <AuthPanel>
      <Stack sx={{ mb: 2 }}>
        <Typography variant="h2" sx={{ mb: 1 }} className={authPanelTitleClassName}>
          {t('title')}
        </Typography>
        <Typography variant="body1">{t('intro')}</Typography>
      </Stack>
      <ScopedIntlClientProvider paths={['common', 'forms']}>
        <LoginForm
          initialEmail={email ?? ''}
          noticeMessage={noticeMessage}
          onResendVerification={resendEmailVerificationAction}
          resendVerificationLabels={{
            cta: tVerify('resendCta'),
            sent: tVerify('resendSent'),
            error: tVerify('resendError')
          }}
        />
      </ScopedIntlClientProvider>
      <Stack sx={{ mt: 2 }}>
        <Typography variant="body1">{t('introForgotPassword')}</Typography>
        <Typography variant="body1" className={styles.forgotLink}>
          <Link href="/forgot-password">{t('forgotPassword')}</Link>
        </Typography>
      </Stack>
    </AuthPanel>
  );
};

export default LoginPage;
