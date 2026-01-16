'use client';

import { useTranslations } from 'next-intl';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import { InscriptionFormData } from '@repo/domain/models/forms/inscription-form-data';
import NiveauScolaireSelect from '@repo/ui/inputs/niveau-scolaire-select';
import ProfilRadioGroup from '@repo/ui/inputs/profil-radio-group';
import { FormActionStateTuple } from '../../form-action-state';
import Link from '../link';
import TextField from '@mui/material/TextField';

export interface InscriptionFormProps {
  actionState: FormActionStateTuple<InscriptionFormData>;
}

export default function InscriptionForm({ actionState: [state, action, isPending] }: InscriptionFormProps) {
  const t = useTranslations('forms');
  const tCommon = useTranslations('common');

  return (
    <form action={action}>
      <Stack spacing={2}>
        {state?.message && !isPending && (
          <Alert severity={state?.isValid ? 'success' : 'error'}>{state?.message}</Alert>
        )}
        <TextField
          name={'prenom'}
          defaultValue={state.values.prenom}
          label={t('fields.prenom')}
          placeholder={t('placeholders.prenom')}
          required
        />
        <TextField
          name={'nom'}
          defaultValue={state.values.nom}
          label={t('fields.nom')}
          placeholder={t('placeholders.nom')}
          required
        />
        <NiveauScolaireSelect defaultValue={state.values.niveauScolaire} />
        <TextField
          name={'email'}
          type={'email'}
          defaultValue={state.values.email}
          label={t('fields.email')}
          placeholder={t('placeholders.email')}
          required
        />
        <TextField
          name={'motDePasse'}
          type={'password'}
          defaultValue={state.values.motDePasse}
          label={t('fields.motDePasse')}
          placeholder={t('placeholders.motDePasse')}
          required
        />
        <TextField
          name={'confirmationMotDePasse'}
          type={'password'}
          defaultValue={state.values.confirmationMotDePasse}
          label={t('fields.confirmationMotDePasse')}
          placeholder={t('placeholders.confirmationMotDePasse')}
          required
        />

        <ProfilRadioGroup defaultValue={state.values.profil} />

        <FormControlLabel
          required
          control={<Checkbox name={'cgu'} defaultChecked={state.values.cgu === 'on'} />}
          label={t('fields.cgu')}
        />
      </Stack>
      <Grid container spacing={2}>
        <Grid>
          <Button variant="outlined" color="secondary" component={Link} href="/">
            {tCommon('actions.back')}
          </Button>
        </Grid>
        <Grid>
          <Button variant="contained" type="submit" disabled={isPending}>
            {t('actions.submitInscription')}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}
