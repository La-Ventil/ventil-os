'use client';

import { use, useActionState, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { AdminProfileFormInput } from '@repo/application/forms';
import { UserProfile } from '@repo/view-models/user-profile';
import { UserRole, requiresEducationLevel } from '@repo/domain/user/user-role';
import EducationLevelSelect from '../inputs/education-level-select';
import ProfileRadioGroup from '../inputs/profile-radio-group';
import { FormAction } from '@repo/form/form-action-state';
import { FormState } from '@repo/form/form-state';
import { firstFieldError } from '@repo/form/form-errors';

export interface AdminUserEditFormProps {
  profilePromise: Promise<UserProfile>;
  handleSubmit: FormAction<AdminProfileFormInput>;
  userId: string;
  onSuccess?: () => void;
}

export default function AdminUserEditForm({
  profilePromise,
  handleSubmit,
  userId,
  onSuccess
}: AdminUserEditFormProps) {
  const t = useTranslations('forms');
  const profile = use(profilePromise);
  const [selectedProfile, setSelectedProfile] = useState<UserRole>(profile.profile);
  const [formState, formAction, pending] = useActionState<FormState<AdminProfileFormInput>, FormData>(handleSubmit, {
    success: false,
    valid: true,
    message: '',
    fieldErrors: {},
    values: {
      firstName: profile.firstName ?? '',
      lastName: profile.lastName,
      profile: profile.profile,
      educationLevel: profile.educationLevel ?? ''
    }
  });
  const fieldError = (field: keyof AdminProfileFormInput) => firstFieldError(formState, field);
  const showEducationLevel = requiresEducationLevel(selectedProfile);

  useEffect(() => {
    setSelectedProfile((formState.values.profile as UserRole | undefined) ?? profile.profile);
  }, [formState.values.profile, profile.profile]);

  useEffect(() => {
    if (formState.success) {
      onSuccess?.();
    }
  }, [formState.success, onSuccess]);

  return (
    <form action={formAction}>
      <input type="hidden" name="userId" value={userId} />
      <Stack spacing={2}>
        {formState.message && !pending ? (
          <Alert severity={formState.success ? 'success' : 'error'}>{formState.message}</Alert>
        ) : null}
        <TextField
          name="firstName"
          defaultValue={formState.values.firstName}
          label={t('fields.firstName')}
          placeholder={t('placeholders.firstName')}
          required
          error={Boolean(fieldError('firstName'))}
          helperText={fieldError('firstName')}
        />
        <TextField
          name="lastName"
          defaultValue={formState.values.lastName}
          label={t('fields.lastName')}
          placeholder={t('placeholders.lastName')}
          required
          error={Boolean(fieldError('lastName'))}
          helperText={fieldError('lastName')}
        />
        <ProfileRadioGroup
          defaultValue={formState.values.profile}
          error={Boolean(fieldError('profile'))}
          helperText={fieldError('profile')}
          onChange={(value) => setSelectedProfile(value as UserRole)}
        />
        {showEducationLevel ? (
          <EducationLevelSelect
            defaultValue={formState.values.educationLevel}
            error={Boolean(fieldError('educationLevel'))}
            helperText={fieldError('educationLevel')}
          />
        ) : null}
      </Stack>
      <Grid container spacing={2}>
        <Grid>
          <Button variant="contained" type="submit" disabled={pending}>
            {t('actions.updateProfile')}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}
