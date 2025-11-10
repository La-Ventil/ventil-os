'use client';

import { useActionState } from 'react';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import { ResetPasswordFormData } from '@repo/domain/models/forms/reset-password-form-data';
import { FormActionState } from '../form-action-state';
import { useFormActionState } from '../hooks';

export interface ResetPasswordForm {
  handleSubmit: FormActionState<ResetPasswordFormData>;
}

export default function ResetPasswordForm({ handleSubmit }: ResetPasswordForm) {
  const [formState, formAction, pending] = useFormActionState<ResetPasswordFormData>(handleSubmit, {
    message: undefined,
    fieldErrors: [],
    values: {
      email: ''
    },
    isValid: undefined
  });

  return (
    <form action={formAction}>
      {formState?.message && !pending && (
        <Alert severity={formState?.isValid ? 'success' : 'error'}>{formState?.message}</Alert>
      )}
      <Stack spacing={2}>
        <TextField name={'email'} label={'Email'} placeholder="email@email.com" required />
      </Stack>
      <Grid container spacing={2}>
        <Grid>
          <Button variant="outlined" color="secondary">
            Retour
          </Button>
        </Grid>
        <Grid>
          <Button variant="contained" type="submit" disabled={pending}>
            Envoyer le lien de réinitialisation.
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}
