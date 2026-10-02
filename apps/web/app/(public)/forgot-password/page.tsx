import { getTranslations } from 'next-intl/server';
import Box from '@mui/material/Box';
import styles from '../page.module.css';
import ScopedIntlClientProvider from '../../../i18n/scoped-intl-client-provider';
import ForgotPasswordPageClient from './_components/forgot-password-page.client';

export default async function Page() {
  const t = await getTranslations('pages.public.forgotPassword');

  return (
    <Box className={styles.connexionContainer}>
      <Box className={styles.infoContainer}>
        <ScopedIntlClientProvider paths={['common', 'forms', 'validation']}>
          <ForgotPasswordPageClient title={t('title')} intro={t('intro')} />
        </ScopedIntlClientProvider>
      </Box>
    </Box>
  );
}
