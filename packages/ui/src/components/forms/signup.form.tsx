'use client';

import { useTranslations } from 'next-intl';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import { SignupFormInput } from '@repo/application/forms';
import EducationLevelSelect from '../inputs/education-level-select';
import ProfileRadioGroup from '../inputs/profile-radio-group';
import Link from '../link';
import TextField from '@mui/material/TextField';
import { FormActionStateTuple } from '@repo/form/use-form-action-state';
import { createFormState } from '@repo/form/form-state';
import FormAlert from './form-alert';

export interface SignupFormProps {
  formState: FormActionStateTuple<SignupFormInput>;
}

export const signupFormInitialState = createFormState<SignupFormInput>({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  passwordConfirmation: '',
  profile: '',
  terms: '',
  educationLevel: ''
});

export default function SignupForm({ formState }: SignupFormProps) {
  const t = useTranslations('forms');
  const tCommon = useTranslations('common');
  const [state, action, isPending, handleSubmit, handleRetry] = formState;

  return (
    <form action={action} onSubmit={handleSubmit}>
      <Stack spacing={2}>
        <FormAlert
          message={state?.message}
          success={state?.success}
          isPending={isPending}
          showRetry={state?.message === t('errors.network')}
          retryLabel={tCommon('actions.retry')}
          onRetry={handleRetry}
        />
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
          control={<Checkbox name="terms" defaultChecked={state.values.terms === 'on'} />}
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
