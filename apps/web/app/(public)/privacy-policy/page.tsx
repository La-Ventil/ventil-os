import { getTranslations } from 'next-intl/server';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export default async function PrivacyPolicyPage() {
  const t = await getTranslations('pages.public.privacyPolicy');

  return (
    <Box>
      <Stack spacing={2}>
        <Typography variant="h2">{t('title')}</Typography>
        <Typography variant="body1">{t('intro')}</Typography>
      </Stack>

      <Stack spacing={1.5} mt={3}>
        <Typography variant="h3">{t('dataCollected.title')}</Typography>
        <Typography variant="body2">{t('dataCollected.content')}</Typography>

        <Typography variant="h3">{t('purposes.title')}</Typography>
        <Typography variant="body2">{t('purposes.content')}</Typography>

        <Typography variant="h3">{t('retention.title')}</Typography>
        <Typography variant="body2">{t('retention.content')}</Typography>

        <Typography variant="h3">{t('rights.title')}</Typography>
        <Typography variant="body2">{t('rights.content')}</Typography>
      </Stack>
    </Box>
  );
}
