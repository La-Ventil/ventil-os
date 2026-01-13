'use client';

import { useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { signInAndRedirect } from '../../../../lib/auth';
import { updatePassword, type UpdatePasswordActionState } from '../../../../lib/actions/update-password';
import { useFormActionState } from '@repo/ui/hooks';

export default function Page() {
  const t = useTranslations('pages.public.updatePassword');
  const tForms = useTranslations('forms');
  const tCommon = useTranslations('common');
  const { token } = useParams<{ token: string }>();
  const initialState: UpdatePasswordActionState = {
    token,
    message: undefined,
    fieldErrors: {},
    values: {
      email: '',
      motDePasse: '',
      confirmationMotDePasse: ''
    },
    isValid: undefined
  };
  const [formState, formAction, pending] = useFormActionState(updatePassword, initialState);
  const router = useRouter();

  useEffect(() => {
    if (formState?.isValid) {
      signInAndRedirect(router)(formState.values.email, formState.values.motDePasse);
    }
  }, [formState]);

  return (
    <Box>
      <Stack spacing={2}>
        <Typography variant="h2">{t('title')}</Typography>
        <Typography variant="body1">{t('intro')}</Typography>
        {formState?.message && !pending && (
          <Alert severity={formState?.isValid ? 'success' : 'error'}>{formState?.message}</Alert>
        )}
      </Stack>
      <form action={formAction}>
        <input type="hidden" name="email" defaultValue={formState.values.email} />
        <Stack spacing={2}>
          <TextField
            name={'motDePasse'}
            defaultValue={formState.values.motDePasse}
            label={tForms('fields.motDePasse')}
            placeholder={tForms('placeholders.motDePasse')}
            required
          />
          <TextField
            name={'confirmationMotDePasse'}
            defaultValue={formState.values.confirmationMotDePasse}
            label={tForms('fields.confirmationMotDePasse')}
            placeholder={tForms('placeholders.confirmationMotDePasse')}
            required
          />
        </Stack>
        <Grid container spacing={2}>
          <Grid>
            <Button variant="outlined" color="secondary">
              {tCommon('actions.back')}
            </Button>
          </Grid>
          <Grid>
            <Button variant="contained" type="submit" disabled={pending}>
              {tForms('actions.submitUpdatePassword')}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
}
