'use client';
import type { JSX } from 'react';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { SignupFormInput, signupFormSchema } from '@repo/application/forms';
import SignupForm, { signupFormInitialState } from '@repo/ui/forms/signup.form';
import { useFormActionState } from '@repo/form/use-form-action-state';
import { registerUser } from '../../../lib/actions/register-user';

export default function Page(): JSX.Element {
  const t = useTranslations('pages.public.signup');
  const tCommon = useTranslations('common');
  const formState = useFormActionState<SignupFormInput>({
    action: registerUser,
    initialState: signupFormInitialState,
    schema: signupFormSchema,
    translate: tCommon
  });
  const [currentState] = formState;
  const router = useRouter();

  useEffect(() => {
    if (currentState?.success) {
      async function signInAndRedirect() {
        await signIn('credentials', {
          redirect: false,
          email: currentState.values.email,
          password: currentState.values.password
        });
        router.push('/hub/profile');
      }

      signInAndRedirect();
    }
  }, [currentState, router]);

  return (
    <Box>
      <Stack spacing={2}>
        <Typography variant="h2">{t('title')}</Typography>
        <Typography variant="h3">{t('subtitle')}</Typography>
        <Typography variant="body1">{t('intro')}</Typography>
      </Stack>
      <SignupForm formState={formState} />
    </Box>
  );
}
