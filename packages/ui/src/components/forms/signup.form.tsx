'use client';

import { useTranslations } from 'next-intl';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import { SignupFormInput } from '@repo/application/forms';
import { ProfileType } from '@repo/domain/profile-type';
import EducationLevelSelect from '../inputs/education-level-select';
import ProfileRadioGroup from '../inputs/profile-radio-group';
import Link from '../link';
import TextField from '@mui/material/TextField';
import { FormActionStateTuple } from '@repo/form/use-form-action-state';
import { createFormState } from '@repo/form/form-state';
import { firstFieldError } from '@repo/form/form-errors';
import { useJsEnabled } from '@repo/form/use-js-enabled';
import FormAlert from './form-alert';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';

export interface SignupFormProps {
  formState: FormActionStateTuple<SignupFormInput>;
}

export const signupFormInitialState = createFormState<SignupFormInput>({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  passwordConfirmation: '',
  profile: ProfileType.Member,
  terms: '',
  educationLevel: ''
});

export default function SignupForm({ formState }: SignupFormProps) {
  const t = useTranslations('forms');
  const tCommon = useTranslations('common');
  const [state, action, isPending, handleSubmit, handleRetry] = formState;
  const jsEnabled = useJsEnabled();
  const fieldError = (field: keyof SignupFormInput) => firstFieldError(state, field);

  return (
    <form action={action} onSubmit={handleSubmit} noValidate={jsEnabled}>
      <Stack spacing={2}>
        <FormAlert state={state} isPending={isPending} onRetry={handleRetry} />
        <TextField
          name="firstName"
          defaultValue={state.values.firstName}
          label={t('fields.firstName')}
          placeholder={t('placeholders.firstName')}
          required
          error={Boolean(fieldError('firstName'))}
          helperText={fieldError('firstName')}
        />
        <TextField
          name="lastName"
          defaultValue={state.values.lastName}
          label={t('fields.lastName')}
          placeholder={t('placeholders.lastName')}
          required
          error={Boolean(fieldError('lastName'))}
          helperText={fieldError('lastName')}
        />
        <TextField
          name={'email'}
          type={'email'}
          defaultValue={state.values.email}
          label={t('fields.email')}
          placeholder={t('placeholders.email')}
          required
          error={Boolean(fieldError('email'))}
          helperText={fieldError('email')}
        />
        <TextField
          name="password"
          type="password"
          defaultValue={state.values.password}
          label={t('fields.password')}
          placeholder={t('placeholders.password')}
          required
          error={Boolean(fieldError('password'))}
          helperText={fieldError('password')}
        />
        <TextField
          name="passwordConfirmation"
          type="password"
          defaultValue={state.values.passwordConfirmation}
          label={t('fields.passwordConfirmation')}
          placeholder={t('placeholders.passwordConfirmation')}
          required
          error={Boolean(fieldError('passwordConfirmation'))}
          helperText={fieldError('passwordConfirmation')}
        />

        <ProfileRadioGroup
          defaultValue={state.values.profile}
          error={Boolean(fieldError('profile'))}
          helperText={fieldError('profile')}
        />
        <EducationLevelSelect
          defaultValue={state.values.educationLevel}
          error={Boolean(fieldError('educationLevel'))}
          helperText={fieldError('educationLevel')}
        />

        <FormControl error={Boolean(fieldError('terms'))}>
          <FormControlLabel
            required
            control={
              <Checkbox
                name="terms"
                defaultChecked={state.values.terms === 'on'}
                key={state.values.terms === 'on' ? 'terms-on' : 'terms-off'}
              />
            }
            label={t('fields.terms')}
          />
          {fieldError('terms') ? <FormHelperText>{fieldError('terms')}</FormHelperText> : null}
        </FormControl>
      </Stack>
      <Grid
        container
        spacing={2}
        sx={{
          justifyContent: 'flex-end'
        }}
      >
        <Grid>
          <Button variant="outlined" color="main" component={Link} href="/">
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
