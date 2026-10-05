import { getTranslations } from 'next-intl/server';
import ScopedIntlClientProvider from '../../../i18n/scoped-intl-client-provider';
import AuthPanel from '../_components/auth-panel';
import ForgotPasswordPageClient from './_components/forgot-password-page.client';

export default async function Page() {
  const t = await getTranslations('pages.public.forgotPassword');

  return (
    <AuthPanel>
      <ScopedIntlClientProvider paths={['common', 'forms', 'validation']}>
        <ForgotPasswordPageClient title={t('title')} intro={t('intro')} />
      </ScopedIntlClientProvider>
    </AuthPanel>
  );
}
