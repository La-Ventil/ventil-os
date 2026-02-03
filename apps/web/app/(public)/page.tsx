import Image from 'next/image';
import { useTranslations } from 'next-intl';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import BottomSlot from '@repo/ui/bottom-slot';
import Link from '@repo/ui/link';
import styles from './page.module.css';

export default function Home() {
  const t = useTranslations('pages.public.home');
  return (
    <Box>
      <Stack spacing={2}>
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
      </Stack>
      <BottomSlot>
        <Grid container spacing={2}>
          <Grid>
            <Button variant="outlined" component={Link} href="/signup">
              {t('ctaSignup')}
            </Button>
          </Grid>
          <Grid>
            <Button variant="contained" component={Link} href="/login">
              {t('ctaSignin')}
            </Button>
          </Grid>
        </Grid>
      </BottomSlot>
    </Box>
  );
}
