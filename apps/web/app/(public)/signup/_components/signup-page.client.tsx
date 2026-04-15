'use client';

import type { JSX } from 'react';
import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/navigation';
import SignupForm, { signupFormInitialState } from '@repo/ui/forms/signup.form';
import Link from '@repo/ui/link';
import { signupFormSchema } from '@repo/application/forms';
import { useFormActionState } from '@repo/form/use-form-action-state';
import { registerUserAction } from '../../../../lib/actions/auth/register-user';
import styles from '../page.module.css';

type SignupPageClientProps = {
  title: string;
  subtitle: string;
  intro: string;
  submitLoginLabel: string;
};

export default function SignupPageClient({
  title,
  subtitle,
  intro,
  submitLoginLabel
}: SignupPageClientProps): JSX.Element {
  const router = useRouter();
  const tCommon = useTranslations('common');
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

  useEffect(() => {
    if (isSuccess) {
      router.replace('/?notice=signup-success');
    }
  }, [isSuccess, router]);

  return (
    <Box p={2}>
      <Stack>
        <Typography className={styles.title} variant="h2">
          {title}
        </Typography>
        <Typography className={styles.subtitle} variant="h3">
          {subtitle}
        </Typography>
        <Typography variant="body1" className={styles.text}>
          {intro}
        </Typography>
      </Stack>
      <SignupForm formState={formState} />
      {isSuccess ? (
        <Stack mt={3}>
          <Button component={Link} href="/login" variant="outlined">
            {submitLoginLabel}
          </Button>
        </Stack>
      ) : null}
    </Box>
  );
}
