'use client';

import { use, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { AdminProfileFormInput, buildAdminProfileFormSchema } from '@repo/application/forms';
import { UserProfile } from '@repo/view-models/user-profile';
import EducationLevelSelect from '../inputs/education-level-select';
import ProfileRadioGroup from '../inputs/profile-radio-group';
import type { FormAction } from '@repo/form/form-action-state';
import { createFormState } from '@repo/form/form-state';
import { createFieldError } from '@repo/form/form-errors';
import { createFormFieldLiveValidation } from '@repo/form/use-form-field-live-validation';
import { useFormActionState } from '@repo/form/use-form-action-state';
import Form from './form';
import FormActions from '../form-actions';
import FormAlert from './form-alert';
import { useProfileEducation } from '../../hooks/use-profile-education';
import { useFieldState } from '@repo/form/use-field-state';

export interface AdminUserEditFormProps {
  profilePromise: Promise<UserProfile>;
  handleSubmit: FormAction<AdminProfileFormInput>;
  userId: string;
  onSuccess?: () => void;
}

export default function AdminUserEditForm({ profilePromise, handleSubmit, userId, onSuccess }: AdminUserEditFormProps) {
  const t = useTranslations('forms');
  const tRoot = useTranslations();
  const profile = use(profilePromise);
  const formSchema = buildAdminProfileFormSchema();

  const [state, action, isPending, handleSubmitForm, handleRetry] = useFormActionState({
    action: handleSubmit,
    initialState: createFormState<AdminProfileFormInput>({
      firstName: profile.firstName ?? '',
      lastName: profile.lastName,
      profile: profile.profile,
      educationLevel: profile.educationLevel ?? ''
    }),
    schema: formSchema,
    translate: tRoot,
    translateFieldError: tRoot
  });

  const fieldError = createFieldError<AdminProfileFormInput>(state);
  const useFieldValidation = createFormFieldLiveValidation(formSchema, {
    state,
    t: (key: string) => tRoot(key)
  });

  const firstName = useFieldValidation('firstName');
  const lastName = useFieldValidation('lastName');
  const profileField = useFieldState<string>({ value: String(state.values.profile) });
  const educationLevel = useFieldState<string>({
    value: state.values.educationLevel ?? ''
  });

  const { showEducationLevel, resolvedEducationLevel } = useProfileEducation({
    profile: profileField.value,
    educationLevel: educationLevel.value
  });

  useEffect(() => {
    if (state.success) {
      onSuccess?.();
    }
  }, [state.success, onSuccess]);

  return (
    <Form action={action} onSubmit={handleSubmitForm}>
      <FormAlert state={state} isPending={isPending} onRetry={handleRetry} />
      <input type="hidden" name="userId" value={userId} />
      <Stack spacing={2}>
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
        <ProfileRadioGroup
          value={profileField.value}
          error={Boolean(fieldError('profile'))}
          helperText={fieldError('profile')}
          onChange={(value) => {
            profileField.setValue(value);
          }}
        />
        {showEducationLevel ? (
          <EducationLevelSelect
            value={resolvedEducationLevel}
            onChange={educationLevel.setValue}
            error={Boolean(fieldError('educationLevel'))}
            helperText={fieldError('educationLevel')}
          />
        ) : null}
      </Stack>
      <FormActions>
        <Button variant="contained" type="submit" disabled={isPending}>
          {t('actions.updateProfile')}
        </Button>
      </FormActions>
    </Form>
  );
}
