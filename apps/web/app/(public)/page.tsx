import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import BottomSlot from '@repo/ui/bottom-slot';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';

export default function Home() {
  const t = useTranslations('home');
  return (
    <Box>
      <Stack spacing={2}>
        <Typography variant="body1">{t('message_bienvenue')}</Typography>
      </Stack>
      <BottomSlot>
        <Grid container spacing={2}>
          <Grid>
            <Button variant="outlined" component={Link} href="/inscription">
              M'inscrire
            </Button>
          </Grid>
          <Grid>
            <Button variant="contained" component={Link} href="/connexion">
              Se connecter
            </Button>
          </Grid>
        </Grid>
      </BottomSlot>
    </Box>
  );
}
