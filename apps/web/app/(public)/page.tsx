import { useTranslations } from 'next-intl';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import BottomSlot from '@repo/ui/bottom-slot';
import Link from '@repo/ui/link';

export default function Home() {
  const t = useTranslations('home');
  const tHome = useTranslations('pages.public.home');
  return (
    <Box>
      <Stack spacing={2}>
        <Typography variant="body1">{t('messageBienvenue')}</Typography>
      </Stack>
      <BottomSlot>
        <Grid container spacing={2}>
          <Grid>
            <Button variant="outlined" component={Link} href="/inscription">
              {tHome('ctaSignup')}
            </Button>
          </Grid>
          <Grid>
            <Button variant="contained" component={Link} href="/connexion">
              {tHome('ctaSignin')}
            </Button>
          </Grid>
        </Grid>
      </BottomSlot>
    </Box>
  );
}
