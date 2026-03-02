import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Link from '@repo/ui/link';
import styles from './page.module.css';

type HomePageProps = {
  searchParams?: Promise<{
    notice?: string;
  }>;
};

export default async function Home({ searchParams }: HomePageProps) {
  const t = await getTranslations('pages.public.home');
  const tRoot = await getTranslations();
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const noticeMessage = resolvedSearchParams?.notice === 'signup-success' ? tRoot('signup.success') : null;
  return (
    <Box p={2}>
      <Stack>
        {noticeMessage ? <Alert severity="success">{noticeMessage}</Alert> : null}
        <Typography variant="body1">{t('messageBienvenue')}</Typography>
        <Typography variant="body1">{t('messageOnboarding')}</Typography>
        <Image
          src="/assets/static/cover-v0-1.svg"
          alt={t('coverAlt')}
          className={styles.cover}
          width={640}
          height={360}
          priority
        />
        <Stack spacing={1} className={styles.buttonGroup}>
          <Button variant="outlined" component={Link} href="/signup">
            {t('ctaSignup')}
          </Button>
          <Button variant="contained" component={Link} href="/login">
            {t('ctaSignin')}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
