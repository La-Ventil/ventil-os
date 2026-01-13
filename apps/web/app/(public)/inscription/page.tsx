'use client';

import { useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { useTranslations } from 'next-intl';
import { inscrireUtilisateur } from '../../../lib/actions/inscrire-utilisateur';
import InscriptionForm from '@repo/ui/forms/inscription.form';
import { useFormActionStateWithValues } from '@repo/ui/hooks';
import { InscriptionFormData } from '@repo/domain/models/forms/inscription-form-data';

export default function Page() {
  const t = useTranslations('pages.public.inscription');
  const actionState = useFormActionStateWithValues<InscriptionFormData>(inscrireUtilisateur, {
    message: '',
    fieldErrors: {},
    values: {
      prenom: '',
      nom: '',
      email: '',
      motDePasse: '',
      confirmationMotDePasse: '',
      profil: '',
      cgu: '',
      niveauScolaire: ''
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
        <Typography variant="h2">{t('title')}</Typography>
        <Typography variant="h3">{t('subtitle')}</Typography>
        <Typography variant="body1">{t('intro')}</Typography>
      </Stack>
      <InscriptionForm actionState={actionState} />
    </Box>
  );
}
