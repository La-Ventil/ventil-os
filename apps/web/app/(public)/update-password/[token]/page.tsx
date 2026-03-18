'use client';
import type { JSX } from 'react';

import { useActionState, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Link from '@repo/ui/link';
import PasswordField from '@repo/ui/forms/password-field';
import { updatePasswordAction, type UpdatePasswordActionState } from '../../../../lib/actions/auth/update-password';
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
  const [formState, formAction, pending] = useActionState(updatePasswordAction, initialState);
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [submittedPassword, setSubmittedPassword] = useState('');

  useEffect(() => {
    if (formState?.success && formState.values.email && submittedPassword) {
      void signInAndRedirect(router)(formState.values.email, submittedPassword);
    }
  }, [formState, router, submittedPassword]);

  return (
    <Box>
      <Stack spacing={2}>
        <Typography variant="h2">{t('title')}</Typography>
        <Typography variant="body1">{t('intro')}</Typography>
        {formState?.message && !pending && (
          <Alert severity={formState?.success ? 'success' : 'error'}>{formState?.message}</Alert>
        )}
      </Stack>
      <form
        action={formAction}
        onSubmit={() => {
          setSubmittedPassword(password);
        }}
      >
        <input type="hidden" name="email" defaultValue={formState.values.email} />
        <Stack spacing={2}>
          <PasswordField
            name="password"
            value={password}
            onChange={(event) => setPassword(event.currentTarget.value)}
            label={tForms('fields.password')}
            placeholder={tForms('placeholders.password')}
            required
            autoComplete="new-password"
            showPasswordLabel={tForms('actions.showPassword')}
            hidePasswordLabel={tForms('actions.hidePassword')}
          />
          <PasswordField
            name="passwordConfirmation"
            value={passwordConfirmation}
            onChange={(event) => setPasswordConfirmation(event.currentTarget.value)}
            label={tForms('fields.passwordConfirmation')}
            placeholder={tForms('placeholders.passwordConfirmation')}
            required
            autoComplete="new-password"
            showPasswordLabel={tForms('actions.showPassword')}
            hidePasswordLabel={tForms('actions.hidePassword')}
          />
        </Stack>
        <Grid container spacing={2}>
          <Grid>
            <Button variant="outlined" color="secondary" component={Link} href="/login">
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
