import { getTranslations } from 'next-intl/server';
import ScopedIntlClientProvider from '../../../i18n/scoped-intl-client-provider';
import SignupPageClient from './_components/signup-page.client';
import Box from '@mui/material/Box';
import styles from '../page.module.css';

export default async function Page() {
  const t = await getTranslations('pages.public.signup');
  const tForms = await getTranslations('forms');

  return (
    <Box className={styles.connexionContainer}>
      <Box className={styles.infoContainer}>
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
      </Box>
    </Box>
  );
}
