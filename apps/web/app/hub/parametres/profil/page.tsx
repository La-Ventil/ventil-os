'use server';

import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ProfilForm from '@repo/ui/forms/profil.form';
import Section from '@repo/ui/section';
import { modifierProfil } from '../../../../lib/actions/modifier-profil';
import { getProfilUtilisateurFromSession } from '../../../../lib/auth';

export default async function Page() {
  const profilUtilisateurPromise = getProfilUtilisateurFromSession();
  const t = await getTranslations('pages.hub.profileSettings');
  const tCommon = await getTranslations('common');

  return (
    <>
      <Section>
          <Typography variant="h2">{t('title')}</Typography>
          <Typography variant="h3">{t('subtitle')}</Typography>
          <Typography variant="body1">{t('intro')}</Typography>
      </Section>
      <Suspense fallback={<div>{tCommon('status.loading')}</div>}>
        <ProfilForm profilUtilisateurPromise={profilUtilisateurPromise} handleSubmit={modifierProfil} />
      </Suspense>
    </>
  );
}
