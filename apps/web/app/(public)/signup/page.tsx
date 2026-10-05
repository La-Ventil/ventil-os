import { getTranslations } from 'next-intl/server';
import ScopedIntlClientProvider from '../../../i18n/scoped-intl-client-provider';
import AuthPanel from '../_components/auth-panel';
import SignupPageClient from './_components/signup-page.client';

export default async function Page() {
  const t = await getTranslations('pages.public.signup');
  const tForms = await getTranslations('forms');

  return (
    <AuthPanel>
      <ScopedIntlClientProvider
        paths={['common', 'educationLevel', 'forms', 'pages.public.privacyPolicy', 'profileSelector', 'validation']}
      >
        <SignupPageClient
          title={t('title')}
          subtitle={t('subtitle')}
          intro={t('intro')}
          submitLoginLabel={tForms('actions.submitLogin')}
        />
      </ScopedIntlClientProvider>
    </AuthPanel>
  );
}
