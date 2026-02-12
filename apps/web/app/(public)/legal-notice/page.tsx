import { getTranslations } from 'next-intl/server';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export default async function LegalNoticePage() {
  const t = await getTranslations('pages.public.legalNotice');

  return (
    <Box>
      <Stack spacing={2}>
        <Typography variant="h2">{t('title')}</Typography>
        <Typography variant="body1">{t('intro')}</Typography>
      </Stack>

      <Stack spacing={1.5} mt={3}>
        <Typography variant="h3">{t('publisher.title')}</Typography>
        <Typography variant="body2">{t('publisher.content')}</Typography>

        <Typography variant="h3">{t('hosting.title')}</Typography>
        <Typography variant="body2">{t('hosting.content')}</Typography>

        <Typography variant="h3">{t('contact.title')}</Typography>
        <Typography variant="body2">{t('contact.content')}</Typography>
      </Stack>
    </Box>
  );
}
