import { getTranslations } from 'next-intl/server';
import ScopedIntlClientProvider from '../../../lib/i18n/scoped-intl-client-provider';
import SignupPageClient from './_components/signup-page.client';

export default async function Page() {
  const t = await getTranslations('pages.public.signup');
  const tForms = await getTranslations('forms');

  return (
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
  );
}
