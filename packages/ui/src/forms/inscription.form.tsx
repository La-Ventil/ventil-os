'use client';

import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import {Button} from '@repo/ui/button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Alert from '@mui/material/Alert';
import ProfilRadioGroup from '@repo/ui/inputs/profil-radio-group';
import NiveauScolaireSelect from '@repo/ui/inputs/niveau-scolaire-select';
import { InscriptionFormData } from '@repo/domain/models/forms/inscription-form-data';
import { FormActionStateTuple } from '../form-action-state';
import { TextField } from '../text-field';
import { EventIcon } from '@repo/ui/icons/event-icon';
import Link from '../link';

export interface InscriptionFormProps {
  actionState: FormActionStateTuple<InscriptionFormData>;
}

export default function InscriptionForm({ actionState: [state, action, isPending] }: InscriptionFormProps) {
  return (
    <form action={action}>
      <Stack spacing={2}>
        {state?.message && !isPending && (
          <Alert severity={state?.isValid ? 'success' : 'error'}>{state?.message}</Alert>
        )}
        <TextField name={'prenom'} label={'Prénom'} placeholder="mon prénom" required />
        <TextField name={'nom'} label={'Nom'} placeholder="mon nom" required />
        <EventIcon color="primary" />
        <NiveauScolaireSelect />
        <TextField name={'email'} type={'email'} label={'Email'} placeholder="email@email.com" required />
        <TextField
          name={'motDePasse'}
          type={'password'}
          label={'Mot de passe'}
          placeholder="minimum 5 caractères"
          required
        />
        <TextField
          name={'confirmationMotDePasse'}
          type={'password'}
          label={'Confirmation du mot de passe'}
          placeholder="même mot de passe que le champ précédent"
          required
        />

        <ProfilRadioGroup />

        <FormControlLabel
          required
          control={<Checkbox name={'cgu'} />}
          label="J’accepte les conditions générales d’utilisation de l’application"
        />
      </Stack>
      <Grid container spacing={2}>
        <Grid>
          <Button variant="outlined" color="secondary" component={Link} href="/">
            Retour
          </Button>
        </Grid>
        <Grid>
          <Button variant="contained" type="submit" disabled={isPending}>
            S'inscrire
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}
