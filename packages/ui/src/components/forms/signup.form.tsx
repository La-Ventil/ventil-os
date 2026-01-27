'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import { SignupFormData } from '@repo/application/forms';
import EducationLevelSelect from '../inputs/education-level-select';
import ProfileRadioGroup from '../inputs/profile-radio-group';
import { FormActionStateTuple } from '../../form-action-state';
import { FormState } from '../../form-state';
import Link from '../link';
import TextField from '@mui/material/TextField';

export interface SignupFormProps {
  actionState: FormActionStateTuple<FormState<SignupFormData>>;
}

export default function SignupForm({ actionState: [state, action, isPending] }: SignupFormProps) {
  const t = useTranslations('forms');
  const tCommon = useTranslations('common');
  const [termsAccepted, setTermsAccepted] = useState(false);

  useEffect(() => {
    setTermsAccepted(state.values.terms === 'on');
  }, [state.values.terms]);

  return (
    <form action={action}>
      <Stack spacing={2}>
        {state?.message && !isPending && (
          <Alert severity={state?.isValid ? 'success' : 'error'}>{state?.message}</Alert>
        )}
        <TextField
          name="firstName"
          defaultValue={state.values.firstName}
          label={t('fields.firstName')}
          placeholder={t('placeholders.firstName')}
          required
        />
        <TextField
          name="lastName"
          defaultValue={state.values.lastName}
          label={t('fields.lastName')}
          placeholder={t('placeholders.lastName')}
          required
        />
        <EducationLevelSelect defaultValue={state.values.educationLevel} />
        <TextField
          name={'email'}
          type={'email'}
          defaultValue={state.values.email}
          label={t('fields.email')}
          placeholder={t('placeholders.email')}
          required
        />
        <TextField
          name="password"
          type="password"
          defaultValue={state.values.password}
          label={t('fields.password')}
          placeholder={t('placeholders.password')}
          required
        />
        <TextField
          name="passwordConfirmation"
          type="password"
          defaultValue={state.values.passwordConfirmation}
          label={t('fields.passwordConfirmation')}
          placeholder={t('placeholders.passwordConfirmation')}
          required
        />

        <ProfileRadioGroup defaultValue={state.values.profile} />

        <FormControlLabel
          required
          control={
            <Checkbox
              name="terms"
              checked={termsAccepted}
              onChange={(event) => setTermsAccepted(event.target.checked)}
            />
          }
          label={t('fields.terms')}
        />
      </Stack>
      <Grid container spacing={2}>
        <Grid>
          <Button variant="outlined" color="secondary" component={Link} href="/">
            {tCommon('actions.back')}
          </Button>
        </Grid>
        <Grid>
          <Button variant="contained" type="submit" disabled={isPending}>
            {t('actions.submitSignup')}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}
