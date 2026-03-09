'use client';

import { useTranslations } from 'next-intl';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Stack from '@mui/material/Stack';
import { SignupFormInput, passwordConfirmationMatchSchema, signupFormSchema } from '@repo/application/forms';
import { UserRole } from '@repo/domain/user/user-role';
import { useId, useState } from 'react';
import EducationLevelSelect from '../inputs/education-level-select';
import ProfileRadioGroup from '../inputs/profile-radio-group';
import TextButtonLink from '../text-button-link';
import Link from '../link';
import ModalLayout from '../modal-layout';
import PrivacyPolicyContent from '../privacy-policy-content';
import TextField from '@mui/material/TextField';
import { FormActionStateTuple } from '@repo/form/use-form-action-state';
import { createFormState } from '@repo/form/form-state';
import { createFormFieldLiveValidation } from '@repo/form/use-form-field-live-validation';
import FormActions from '../form-actions';
import FormAlert from './form-alert';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Form from './form';
import { createFieldError } from '@repo/form/form-errors';
import { useFormFieldCrossValidation } from '@repo/form/use-form-field-cross-validation';
import { useFieldState } from '@repo/form/use-field-state';
import { useProfileEducation } from '../../hooks/use-profile-education';

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
  const tValidation = useTranslations();
  const tCommon = useTranslations('common');
  const tPolicy = useTranslations('pages.public.privacyPolicy');
  const [state, action, isPending, handleSubmit, handleRetry] = formState;
  const fieldError = createFieldError<SignupFormInput>(state);
  const useSignupFieldValidation = createFormFieldLiveValidation(signupFormSchema, {
    state,
    t: (key: string) => tValidation(key)
  });

  const firstName = useSignupFieldValidation('firstName');
  const lastName = useSignupFieldValidation('lastName');
  const email = useSignupFieldValidation('email');
  const password = useSignupFieldValidation('password');
  const profile = useFieldState<string>({ value: String(state.values.profile) });
  const educationLevel = useFieldState<string>({ value: state.values.educationLevel ?? '' });
  const passwordConfirmation = useFormFieldCrossValidation<SignupFormInput, 'passwordConfirmation'>({
    values: {
      ...state.values,
      password: password.value,
      passwordConfirmation: state.values.passwordConfirmation
    },
    field: 'passwordConfirmation',
    schema: passwordConfirmationMatchSchema,
    t: (key: string) => tValidation(key),
    serverError: fieldError('passwordConfirmation')
  });
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const privacyTitleId = useId();
  const privacyIntroId = useId();

  const { showEducationLevel, resolvedEducationLevel } = useProfileEducation({
    profile: profile.value,
    educationLevel: educationLevel.value
  });
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
            {...passwordConfirmation.fieldProps()}
            label={t('fields.passwordConfirmation')}
            placeholder={t('placeholders.passwordConfirmation')}
            required
          />

          <ProfileRadioGroup
            value={profile.value}
            onChange={profile.setValue}
            error={Boolean(fieldError('profile'))}
            helperText={fieldError('profile')}
          />
          {showEducationLevel ? (
            <EducationLevelSelect
              value={resolvedEducationLevel}
              onChange={educationLevel.setValue}
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
                link: (chunks) => <TextButtonLink onClick={() => setIsPrivacyOpen(true)}>{chunks}</TextButtonLink>
              })}
            />
            {fieldError('terms') ? <FormHelperText>{fieldError('terms')}</FormHelperText> : null}
          </FormControl>
        </Stack>
        <FormActions justifyContent="flex-end">
          <Button variant="outlined" color="primary" component={Link} href="/">
            {tCommon('actions.back')}
          </Button>
          <Button variant="contained" type="submit" disabled={isPending}>
            {t('actions.submitSignup')}
          </Button>
        </FormActions>
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
