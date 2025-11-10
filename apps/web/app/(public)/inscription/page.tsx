'use client';

import { useActionState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { inscrireUtilisateur } from '../../../lib/actions/inscrire-utilisateur';
import InscriptionForm from '@repo/ui/forms/inscription.form';

export default function Page() {
  const actionState = useActionState(inscrireUtilisateur, {
    message: undefined,
    fieldErrors: [],
    values: {
      prenom: '',
      nom: '',
      email: '',
      motDePasse: '',
      confirmationMotDePasse: '',
      cgu: false
    },
    isValid: undefined
  });
  const [formState, formAction, pending] = actionState;
  const router = useRouter();

  useEffect(() => {
    if (formState?.isValid) {
      async function signInAndRedirect() {
        await signIn('credentials', {
          redirect: false,
          email: formState.values.email,
          password: formState.values.motDePasse
        });
        router.push('/hub/profil');
      }

      signInAndRedirect();
    }
  }, [formState]);

  return (
    <Box>
      <Stack spacing={2}>
        <Typography variant="h2">Inscription</Typography>
        <Typography variant="h3">Information</Typography>
        <Typography variant="body1">
          Bienvenue sur l’application de La-Ventil. Pour commencer l’aventure, merci de saisir les informations
          ci-dessous.
        </Typography>
      </Stack>
      <InscriptionForm actionState={actionState} />
    </Box>
  );
}
