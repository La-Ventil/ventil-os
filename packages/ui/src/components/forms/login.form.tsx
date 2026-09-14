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
import PasswordField from './password-field';
import ResendVerification, { type ResendVerificationLabels } from './resend-verification';

export type LoginFormProps = {
  initialEmail?: string;
  noticeMessage?: string;
  onResendVerification?: (email: string) => Promise<{ ok: boolean }>;
  resendVerificationLabels?: ResendVerificationLabels;
};

/**
 * Every rejection says the same thing, whatever the reason. Telling a stranger that an address is
 * blocked, or merely unconfirmed, tells them the account exists — and the offer to send a new
 * confirmation link is shown to everyone for the same reason.
 */
export default function LoginForm({
  initialEmail = '',
  noticeMessage,
  onResendVerification,
  resendVerificationLabels
}: LoginFormProps) {
  const t = useTranslations('forms');
  const tCommon = useTranslations('common');
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState('');
  const [formState, setFormState] = useState<{
    message: string;
    success?: boolean;
    /** The address the attempt was made with: the field may be edited before the button is used. */
    rejectedEmail?: string;
  }>({
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
        success: false,
        rejectedEmail: email
      });
    }
  }

  return (
    <form onSubmit={(e) => void onSignin(e)}>
      <Stack spacing={2}>
        {noticeMessage && <Alert severity="info">{noticeMessage}</Alert>}
        {formState?.message && <Alert severity={formState?.success ? 'success' : 'error'}>{formState?.message}</Alert>}
        {formState?.rejectedEmail && onResendVerification && resendVerificationLabels ? (
          <ResendVerification
            key={formState.rejectedEmail}
            email={formState.rejectedEmail}
            onResend={onResendVerification}
            labels={resendVerificationLabels}
          />
        ) : null}
        <TextField
          name={'email'}
          value={email}
          onChange={(e) => setEmail(e.currentTarget.value)}
          label={t('fields.email')}
          placeholder={t('placeholders.email')}
          required
        />
        <PasswordField
          name="password"
          label={t('fields.password')}
          value={password}
          onChange={(e) => setPassword(e.currentTarget.value)}
          placeholder={t('placeholders.password')}
          autoComplete="current-password"
          showPasswordLabel={t('actions.showPassword')}
          hidePasswordLabel={t('actions.hidePassword')}
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
