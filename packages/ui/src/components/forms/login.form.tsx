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

export type LoginFormProps = {
  initialEmail?: string;
  noticeMessage?: string;
};

export default function LoginForm({ initialEmail = '', noticeMessage }: LoginFormProps) {
  const t = useTranslations('forms');
  const tCommon = useTranslations('common');
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState('');
  const [formState, setFormState] = useState<{ message: string; success?: boolean }>({
    message: ''
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
        success: true
      });
      router.push('/hub/profile');
    } else {
      setFormState({
        message: t('messages.signInFailed'),
        success: false
      });
    }
  }

  return (
    <form onSubmit={(e) => void onSignin(e)}>
      <Stack spacing={2}>
        {noticeMessage && <Alert severity="info">{noticeMessage}</Alert>}
        {formState?.message && <Alert severity={formState?.success ? 'success' : 'error'}>{formState?.message}</Alert>}
        <TextField
          name={'email'}
          value={email}
          onChange={(e) => setEmail(e.currentTarget.value)}
          label={t('fields.email')}
          placeholder={t('placeholders.email')}
          required
        />
        <TextField
          name="password"
          label={t('fields.password')}
          value={password}
          onChange={(e) => setPassword(e.currentTarget.value)}
          placeholder={t('placeholders.password')}
          type="password"
          autoComplete="current-password"
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
            {t('actions.submitLogin')}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}
