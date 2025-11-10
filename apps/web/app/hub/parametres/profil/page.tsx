'use server';

import { Suspense } from 'react';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { getProfilUtilisateurFromSession } from '../../../../lib/auth';
import { inscrireUtilisateur } from '../../../../lib/actions/inscrire-utilisateur';
import ProfilForm from '@repo/ui/forms/profil.form';

export default async function Page() {
  const profilUtilisateurPromise = getProfilUtilisateurFromSession();

  return (
    <Box>
      <Stack spacing={2}>
        <Typography variant="h2">Profil utilisateur</Typography>
        <Typography variant="h3">Information</Typography>
        <Typography variant="body1">
          Modifiez les informations de votre compte avec les rubriques ci-dessous.
        </Typography>
      </Stack>
      <Suspense fallback={<div>Loading...</div>}>
        <ProfilForm profilUtilisateurPromise={profilUtilisateurPromise} handleSubmit={inscrireUtilisateur} />
      </Suspense>
    </Box>
  );
}
