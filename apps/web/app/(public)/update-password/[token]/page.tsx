'use client';
import type { JSX } from 'react';

import { useActionState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { updatePassword, type UpdatePasswordActionState } from '../../../../lib/actions/update-password';
import { signInAndRedirect } from '../../../../lib/auth';

export default function Page(): JSX.Element {
  const t = useTranslations('pages.public.updatePassword');
  const tForms = useTranslations('forms');
  const tCommon = useTranslations('common');
  const { token } = useParams<{ token: string }>();
  const initialState: UpdatePasswordActionState = {
    token,
    success: false,
    valid: true,
    message: '',
    fieldErrors: {},
    values: {
      email: '',
      password: '',
      passwordConfirmation: ''
    },
    isValid: undefined
  };
  const [formState, formAction, pending] = useActionState(updatePassword, initialState);
  const router = useRouter();

  useEffect(() => {
    if (formState?.success && formState.values.email) {
      signInAndRedirect(router)(formState.values.email, formState.values.password);
    }
  }, [formState, router]);

  return (
    <Box>
      <Stack spacing={2}>
        <Typography variant="h2">{t('title')}</Typography>
        <Typography variant="body1">{t('intro')}</Typography>
        {formState?.message && !pending && (
          <Alert severity={formState?.success ? 'success' : 'error'}>{formState?.message}</Alert>
        )}
      </Stack>
      <form action={formAction}>
        <input type="hidden" name="email" defaultValue={formState.values.email} />
        <Stack spacing={2}>
          <TextField
            name="password"
            defaultValue={formState.values.password}
            label={tForms('fields.password')}
            placeholder={tForms('placeholders.password')}
            required
          />
          <TextField
            name="passwordConfirmation"
            defaultValue={formState.values.passwordConfirmation}
            label={tForms('fields.passwordConfirmation')}
            placeholder={tForms('placeholders.passwordConfirmation')}
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
