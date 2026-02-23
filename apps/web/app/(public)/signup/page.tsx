'use client';
import type { JSX } from 'react';

import { useTranslations } from 'next-intl';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Link from '@repo/ui/link';
import { signupFormSchema } from '@repo/application/forms';
import SignupForm, { signupFormInitialState } from '@repo/ui/forms/signup.form';
import { useFormActionState } from '@repo/form/use-form-action-state';
import { registerUserAction } from '../../../lib/actions/register-user';
import styles from './page.module.css';

export default function Page(): JSX.Element {
  const t = useTranslations('pages.public.signup');
  const tCommon = useTranslations('common');
  const tForms = useTranslations('forms');
  const tRoot = useTranslations();
  const formState = useFormActionState({
    action: registerUserAction,
    initialState: signupFormInitialState,
    schema: signupFormSchema,
    translate: tCommon,
    translateFieldError: tRoot
  });
  const [currentState] = formState;
  const isSuccess = Boolean(currentState?.success);

  return (
    <Box p={2}>
      <Stack>
        <Typography className={styles.title} variant="h2">
          {t('title')}
        </Typography>
        <Typography className={styles.subtitle} variant="h3">
          {t('subtitle')}
        </Typography>
        <Typography variant="body1" className={styles.text}>
          {t('intro')}
        </Typography>
      </Stack>
      <SignupForm formState={formState} />
      {isSuccess ? (
        <Stack mt={3}>
          <Button component={Link} href="/login" variant="outlined">
            {tForms('actions.submitLogin')}
          </Button>
        </Stack>
      ) : null}
    </Box>
  );
}
