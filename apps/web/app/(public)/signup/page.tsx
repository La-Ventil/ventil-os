'use client';
import type { JSX } from 'react';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { SignupFormData } from '@repo/application/forms';
import SignupForm from '@repo/ui/forms/signup.form';
import { useFormActionStateWithValues } from '@repo/ui/hooks';
import { registerUser } from '../../../lib/actions/register-user';

export default function Page(): JSX.Element {
  const t = useTranslations('pages.public.signup');
  const actionState = useFormActionStateWithValues<SignupFormData>(registerUser, {
    message: '',
    fieldErrors: {},
    values: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      passwordConfirmation: '',
      profile: '',
      terms: '',
      educationLevel: ''
    },
    isValid: undefined
  });
  const [formState, formAction, pending] = actionState;
  const router = useRouter();

  useEffect(() => {
    if (formState?.isValid) {
      async function signInAndRedirect() {
        await signIn('credentials', {
          redirect: false,
          email: formState.values.email,
          password: formState.values.password
        });
        router.push('/hub/profile');
      }

      signInAndRedirect();
    }
  }, [formState]);

  return (
    <Box>
      <Stack spacing={2}>
        <Typography variant="h2">{t('title')}</Typography>
        <Typography variant="h3">{t('subtitle')}</Typography>
        <Typography variant="body1">{t('intro')}</Typography>
      </Stack>
      <SignupForm actionState={actionState} />
    </Box>
  );
}
