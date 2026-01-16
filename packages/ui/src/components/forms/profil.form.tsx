'use client';

import { use } from 'react';
import { useTranslations } from 'next-intl';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { ProfilFormData } from '@repo/domain/models/forms/profil-form-data';
import { ProfilUtilisateur } from '@repo/domain/profil-utilisateur';
import NiveauScolaireSelect from '@repo/ui/inputs/niveau-scolaire-select';
import { FormAction } from '../../form-action-state';
import { useFormActionStateWithValues } from '../../hooks';
import Link from '../link';

export interface ProfilFormProps {
  profilUtilisateurPromise: Promise<ProfilUtilisateur>;
  handleSubmit: FormAction<ProfilFormData>;
}

export default function ProfilForm({ profilUtilisateurPromise, handleSubmit }: ProfilFormProps) {
  const t = useTranslations('forms');
  const tCommon = useTranslations('common');
  const profilUtilisateur = use(profilUtilisateurPromise);
  const [formState, formAction, pending] = useFormActionStateWithValues<ProfilFormData>(handleSubmit, {
    message: '',
    fieldErrors: {},
    values: {
      prenom: profilUtilisateur.prenom ?? '',
      nom: profilUtilisateur.nom ?? '',
      niveauScolaire: profilUtilisateur.niveauScolaire ?? ''
    },
    isValid: undefined
  });

  return (
    <form action={formAction}>
      <Stack spacing={2}>
        {formState?.message && !pending && (
          <Alert severity={formState?.isValid ? 'success' : 'error'}>{formState?.message}</Alert>
        )}
        <TextField
          name={'prenom'}
          defaultValue={formState.values.prenom}
          label={t('fields.prenom')}
          placeholder={t('placeholders.prenom')}
          required
        />
        <TextField
          name={'nom'}
          defaultValue={formState.values.nom}
          label={t('fields.nom')}
          placeholder={t('placeholders.nom')}
          required
        />
        <NiveauScolaireSelect defaultValue={formState.values.niveauScolaire} />
      </Stack>
      <Grid container spacing={2}>
        <Grid>
          <Button variant="outlined" color="secondary" component={Link} href="/">
            {tCommon('actions.back')}
          </Button>
        </Grid>
        <Grid>
          <Button variant="contained" type="submit" disabled={pending}>
            {t('actions.updateProfile')}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}
