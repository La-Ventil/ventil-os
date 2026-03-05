'use client';

import { useTranslations } from 'next-intl';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import MuiLink from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import { SignupFormInput, nameSchema, passwordSchema } from '@repo/application/forms';
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
import { fieldErrorMessage } from '@repo/form/form-errors';
import { useZodLiveValidation } from '@repo/form/use-zod-live-validation';
import { useServerFieldValidation } from '@repo/form/use-server-field-validation';
import { usePasswordConfirmationValidation } from '../../hooks/use-password-confirmation-validation';
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
  const fieldError = (field: keyof SignupFormInput) => fieldErrorMessage(state, field);

  const resolveProfileType = (value?: string): UserRole =>
    Object.values(UserRole).includes(value as UserRole) ? (value as UserRole) : UserRole.Member;
  const [selectedProfile, setSelectedProfile] = useState<UserRole>(() => resolveProfileType(state.values.profile));
  const firstName = useZodLiveValidation({
    schema: nameSchema(),
    value: state.values.firstName,
    serverError: fieldError('firstName'),
    t: (key) => tRoot(key)
  });
  const lastName = useZodLiveValidation({
    schema: nameSchema(),
    value: state.values.lastName,
    serverError: fieldError('lastName'),
    t: (key) => tRoot(key)
  });
  const password = useZodLiveValidation({
    schema: passwordSchema,
    value: state.values.password,
    serverError: fieldError('password'),
    t: (key) => tRoot(key)
  });
  const email = useServerFieldValidation({
    value: state.values.email,
    serverError: fieldError('email')
  });
  const { passwordConfirmation, errors: passwordConfirmationErrors } = usePasswordConfirmationValidation({
    password: password.value,
    passwordConfirmation: state.values.passwordConfirmation,
    t: (key) => tRoot(key)
  });
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const privacyTitleId = useId();
  const privacyIntroId = useId();

  useEffect(() => {
    setSelectedProfile(resolveProfileType(state.values.profile));
  }, [state.values.profile]);

  const defaultEducationLevel =
    state.values.educationLevel || (requiresEducationLevel(selectedProfile) ? EducationLevel.Premiere : '');
  return (
    <>
      <Form action={action} onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <FormAlert state={state} isPending={isPending} onRetry={handleRetry} />
          <TextField
            name="firstName"
            label={t('fields.firstName')}
            placeholder={t('placeholders.firstName')}
            required
            {...firstName.fieldProps()}
          />
          <TextField
            name="lastName"
            label={t('fields.lastName')}
            placeholder={t('placeholders.lastName')}
            required
            {...lastName.fieldProps()}
          />
          <TextField
            name="email"
            type="email"
            label={t('fields.email')}
            placeholder={t('placeholders.email')}
            required
            {...email.fieldProps()}
          />
          <TextField
            name="password"
            type="password"
            label={t('fields.password')}
            placeholder={t('placeholders.password')}
            required
            {...password.fieldProps()}
          />
          <TextField
            name="passwordConfirmation"
            type="password"
            value={passwordConfirmation.value}
            onChange={(event) => passwordConfirmation.setValue(event.currentTarget.value)}
            onBlur={passwordConfirmation.markTouched}
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
