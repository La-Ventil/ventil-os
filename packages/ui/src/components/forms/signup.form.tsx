'use client';

import { useTranslations } from 'next-intl';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import MuiLink from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import {
  SignupFormInput,
  DEFAULT_NAME_MAX_LENGTH,
  containsEmoji,
  PASSWORD_MIN_LENGTH,
  passwordHasLowercase,
  passwordHasNumber,
  passwordHasUppercase
} from '@repo/application/forms';
import { EducationLevel } from '@repo/domain/user/education-level';
import { UserRole, requiresEducationLevel } from '@repo/domain/user/user-role';
import { useEffect, useId, useState } from 'react';
import EducationLevelSelect from '../inputs/education-level-select';
import ProfileRadioGroup from '../inputs/profile-radio-group';
import Link from '../link';
import ModalLayout from '../modal-layout';
import PrivacyPolicyContent from '../privacy-policy-content';
import TextField from '@mui/material/TextField';
import { FormActionStateTuple } from '@repo/form/use-form-action-state';
import { createFormState } from '@repo/form/form-state';
import { firstFieldError } from '@repo/form/form-errors';
import FormAlert from './form-alert';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Form from './form';

export interface SignupFormProps {
  formState: FormActionStateTuple<SignupFormInput>;
}

export const signupFormInitialState = createFormState<SignupFormInput>({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  passwordConfirmation: '',
  profile: UserRole.Member,
  terms: '',
  educationLevel: ''
});

export default function SignupForm({ formState }: SignupFormProps) {
  const t = useTranslations('forms');
  const tRoot = useTranslations();
  const tCommon = useTranslations('common');
  const tPolicy = useTranslations('pages.public.privacyPolicy');
  const [state, action, isPending, handleSubmit, handleRetry] = formState;
  const fieldError = (field: keyof SignupFormInput) => firstFieldError(state, field);
  const resolveProfileType = (value?: string): UserRole =>
    Object.values(UserRole).includes(value as UserRole) ? (value as UserRole) : UserRole.Member;
  const [selectedProfile, setSelectedProfile] = useState<UserRole>(() => resolveProfileType(state.values.profile));
  const [firstName, setFirstName] = useState(state.values.firstName);
  const [lastName, setLastName] = useState(state.values.lastName);
  const [password, setPassword] = useState(state.values.password);
  const [passwordConfirmation, setPasswordConfirmation] = useState(state.values.passwordConfirmation);
  const [firstNameTouched, setFirstNameTouched] = useState(false);
  const [lastNameTouched, setLastNameTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [passwordConfirmationTouched, setPasswordConfirmationTouched] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const privacyTitleId = useId();
  const privacyIntroId = useId();

  useEffect(() => {
    setSelectedProfile(resolveProfileType(state.values.profile));
  }, [state.values.profile]);

  useEffect(() => {
    setFirstName(state.values.firstName);
  }, [state.values.firstName]);

  useEffect(() => {
    setLastName(state.values.lastName);
  }, [state.values.lastName]);

  useEffect(() => {
    setPassword(state.values.password);
  }, [state.values.password]);

  useEffect(() => {
    setPasswordConfirmation(state.values.passwordConfirmation);
  }, [state.values.passwordConfirmation]);

  const firstNameErrors = validateSignupNameErrors(firstName, firstNameTouched, {
    required: tRoot('validation.signup.firstNameRequired'),
    maxLength: tRoot('validation.signup.firstNameMaxLength'),
    noEmoji: tRoot('validation.signup.firstNameNoEmoji')
  });
  const lastNameErrors = validateSignupNameErrors(lastName, lastNameTouched, {
    required: tRoot('validation.signup.lastNameRequired'),
    maxLength: tRoot('validation.signup.lastNameMaxLength'),
    noEmoji: tRoot('validation.signup.lastNameNoEmoji')
  });
  const passwordErrors = validatePasswordErrors(password, passwordTouched, {
    minLength: tRoot('validation.password.minLength'),
    uppercaseRequired: tRoot('validation.password.uppercaseRequired'),
    lowercaseRequired: tRoot('validation.password.lowercaseRequired'),
    numberRequired: tRoot('validation.password.numberRequired')
  });
  const passwordConfirmationErrors = validatePasswordConfirmationErrors(
    password,
    passwordConfirmation,
    passwordConfirmationTouched,
    {
      required: tRoot('validation.password.confirmationRequired'),
      mismatch: tRoot('validation.password.confirmationMismatch')
    }
  );
  const defaultEducationLevel =
    state.values.educationLevel || (requiresEducationLevel(selectedProfile) ? EducationLevel.Premiere : '');

  return (
    <>
      <Form action={action} onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <FormAlert state={state} isPending={isPending} onRetry={handleRetry} />
          <TextField
            name="firstName"
            value={firstName}
            onChange={(event) => setFirstName(event.currentTarget.value)}
            onBlur={() => setFirstNameTouched(true)}
            label={t('fields.firstName')}
            placeholder={t('placeholders.firstName')}
            required
            error={Boolean(firstNameErrors.length || fieldError('firstName'))}
            helperText={firstNameErrors.length ? firstNameErrors.join(' ') : fieldError('firstName')}
          />
          <TextField
            name="lastName"
            value={lastName}
            onChange={(event) => setLastName(event.currentTarget.value)}
            onBlur={() => setLastNameTouched(true)}
            label={t('fields.lastName')}
            placeholder={t('placeholders.lastName')}
            required
            error={Boolean(lastNameErrors.length || fieldError('lastName'))}
            helperText={lastNameErrors.length ? lastNameErrors.join(' ') : fieldError('lastName')}
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
            value={password}
            onChange={(event) => setPassword(event.currentTarget.value)}
            onBlur={() => setPasswordTouched(true)}
            label={t('fields.password')}
            placeholder={t('placeholders.password')}
            required
            error={Boolean(passwordErrors.length || fieldError('password'))}
            helperText={passwordErrors.length ? passwordErrors.join(' ') : fieldError('password')}
          />
          <TextField
            name="passwordConfirmation"
            type="password"
            value={passwordConfirmation}
            onChange={(event) => setPasswordConfirmation(event.currentTarget.value)}
            onBlur={() => setPasswordConfirmationTouched(true)}
            label={t('fields.passwordConfirmation')}
            placeholder={t('placeholders.passwordConfirmation')}
            required
            error={Boolean(passwordConfirmationErrors.length || fieldError('passwordConfirmation'))}
            helperText={
              passwordConfirmationErrors.length
                ? passwordConfirmationErrors.join(' ')
                : fieldError('passwordConfirmation')
            }
          />

          <ProfileRadioGroup
            defaultValue={state.values.profile}
            error={Boolean(fieldError('profile'))}
            helperText={fieldError('profile')}
            onChange={(value) => setSelectedProfile(resolveProfileType(value))}
          />
          {requiresEducationLevel(selectedProfile) ? (
            <EducationLevelSelect
              defaultValue={defaultEducationLevel}
              error={Boolean(fieldError('educationLevel'))}
              helperText={fieldError('educationLevel')}
            />
          ) : null}

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
              label={t.rich('fields.terms', {
                link: (chunks) => (
                  <MuiLink
                    component="button"
                    type="button"
                    underline="always"
                    onClick={() => setIsPrivacyOpen(true)}
                    sx={{ cursor: 'pointer', border: 0, padding: 0, background: 'none', font: 'inherit' }}
                  >
                    {chunks}
                  </MuiLink>
                )
              })}
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
            <Button variant="outlined" color="primary" component={Link} href="/">
              {tCommon('actions.back')}
            </Button>
          </Grid>
          <Grid>
            <Button variant="contained" type="submit" disabled={isPending}>
              {t('actions.submitSignup')}
            </Button>
          </Grid>
        </Grid>
      </Form>
      <ModalLayout
        open={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
        closeLabel={tCommon('actions.back')}
        maxWidth="md"
        fullWidth
        ariaLabelledBy={privacyTitleId}
        ariaDescribedBy={privacyIntroId}
      >
        <PrivacyPolicyContent t={tPolicy} titleId={privacyTitleId} introId={privacyIntroId} />
      </ModalLayout>
    </>
  );
}

const validateSignupNameErrors = (
  value: string,
  touched: boolean,
  messages: { required: string; maxLength: string; noEmoji: string }
): string[] => {
  const errors: string[] = [];

  if (touched && value.length === 0) {
    errors.push(messages.required);
  }

  if (value.length > DEFAULT_NAME_MAX_LENGTH) {
    errors.push(messages.maxLength);
  }

  if (containsEmoji(value)) {
    errors.push(messages.noEmoji);
  }

  return errors;
};

const validatePasswordErrors = (
  value: string,
  touched: boolean,
  messages: {
    minLength: string;
    uppercaseRequired: string;
    lowercaseRequired: string;
    numberRequired: string;
  }
): string[] => {
  const errors: string[] = [];

  if (touched && value.length === 0) {
    errors.push(messages.minLength);
    return errors;
  }

  if (value.length === 0) {
    return errors;
  }

  if (value.length < PASSWORD_MIN_LENGTH) {
    errors.push(messages.minLength);
  }

  if (!passwordHasUppercase(value)) {
    errors.push(messages.uppercaseRequired);
  }

  if (!passwordHasLowercase(value)) {
    errors.push(messages.lowercaseRequired);
  }

  if (!passwordHasNumber(value)) {
    errors.push(messages.numberRequired);
  }

  return errors;
};

const validatePasswordConfirmationErrors = (
  password: string,
  confirmation: string,
  touched: boolean,
  messages: { required: string; mismatch: string }
): string[] => {
  const errors: string[] = [];

  if (touched && confirmation.length === 0) {
    errors.push(messages.required);
    return errors;
  }

  if (confirmation.length === 0) {
    return errors;
  }

  if (password !== confirmation) {
    errors.push(messages.mismatch);
  }

  return errors;
};
