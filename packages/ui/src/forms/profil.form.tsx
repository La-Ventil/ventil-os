'use client';

import { use } from 'react';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { ProfilUtilisateur } from '@repo/domain/profil-utilisateur';
import NiveauScolaireSelect from '@repo/ui/inputs/niveau-scolaire-select';
import { ProfilFormData } from '@repo/domain/models/forms/profil-form-data';
import { FormAction } from '../form-action-state';
import { useFormActionState } from '../hooks';
import Link from '../link';

export interface ProfilFormProps {
  profilUtilisateurPromise: Promise<ProfilUtilisateur>;
  handleSubmit: FormAction<ProfilFormData>;
}

export default function ProfilForm({ profilUtilisateurPromise, handleSubmit }: ProfilFormProps) {
  const profilUtilisateur = use(profilUtilisateurPromise);
  const [formState, formAction, pending] = useFormActionState<ProfilFormData>(handleSubmit, {
    message: undefined,
    fieldErrors: [],
    values: profilUtilisateur,
    isValid: undefined
  });

  return (
    <form action={formAction}>
      <Stack spacing={2}>
        {formState?.message && !pending && (
          <Alert severity={formState?.isValid ? 'success' : 'error'}>{formState?.message}</Alert>
        )}
        <TextField name={'prenom'} value={formState.values.prenom} label={'Prénom'} placeholder="mon prénom" required />
        <TextField name={'nom'} value={formState.values.nom} label={'Nom'} placeholder="mon nom" required />
        <NiveauScolaireSelect />
      </Stack>
      <Grid container spacing={2}>
        <Grid>
          <Button variant="outlined" color="secondary" component={Link} href="/">
            Retour
          </Button>
        </Grid>
        <Grid>
          <Button variant="contained" type="submit" disabled={pending}>
            Modifier
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}
