'use server';

import { Suspense } from 'react';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import ProfilForm from '@repo/ui/forms/profil.form';
import { getProfilUtilisateurFromSession } from '../../../../lib/auth';
import { modifierProfil } from '../../../../lib/actions/modifier-profil';
import { getTranslations } from 'next-intl/server';

export default async function Page() {
  const profilUtilisateurPromise = getProfilUtilisateurFromSession();
  const t = await getTranslations('pages.hub.profileSettings');
  const tCommon = await getTranslations('common');

  return (
    <Box>
      <Stack spacing={2}>
        <Typography variant="h2">{t('title')}</Typography>
        <Typography variant="h3">{t('subtitle')}</Typography>
        <Typography variant="body1">{t('intro')}</Typography>
      </Stack>
      <Suspense fallback={<div>{tCommon('status.loading')}</div>}>
        <ProfilForm profilUtilisateurPromise={profilUtilisateurPromise} handleSubmit={modifierProfil} />
      </Suspense>
    </Box>
  );
}
