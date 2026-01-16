'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Link from '../link';

export default function ConnexionForm() {
  const t = useTranslations('forms');
  const tCommon = useTranslations('common');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formState, setFormState] = useState({
    message: '',
    isValid: undefined
  });
  const router = useRouter();

  async function onSignin(e: FormEvent) {
    e.preventDefault();
    const result = await signIn('credentials', {
      redirect: false,
      email,
      password
    });

    if (result?.ok) {
      setFormState({
        message: t('messages.signInSuccess'),
        isValid: true
      });
      router.push('/hub/profil');
    } else {
      setFormState({
        message: t('messages.signInFailed'),
        isValid: false
      });
    }
  }

  return (
    <form onSubmit={(e) => void onSignin(e)}>
      <Stack spacing={2}>
        {formState?.message && <Alert severity={formState?.isValid ? 'success' : 'error'}>{formState?.message}</Alert>}
        <TextField
          name={'email'}
          value={email}
          onChange={(e) => setEmail(e.currentTarget.value)}
          label={t('fields.email')}
          placeholder={t('placeholders.email')}
          required
        />
        <TextField
          name={'motDePasse'}
          label={t('fields.motDePasse')}
          value={password}
          onChange={(e) => setPassword(e.currentTarget.value)}
          placeholder={t('placeholders.motDePasse')}
          required
        />
      </Stack>
      <Grid container spacing={2}>
        <Grid>
          <Button variant="outlined" color="secondary" component={Link} href="/">
            {tCommon('actions.back')}
          </Button>
        </Grid>
        <Grid>
          <Button variant="contained" type="submit">
            {t('actions.submitConnexion')}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}
