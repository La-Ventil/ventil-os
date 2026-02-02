'use client';

import { use, useActionState } from 'react';
import { useTranslations } from 'next-intl';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { ProfileFormInput } from '@repo/application/forms';
import { UserProfile } from '@repo/view-models/user-profile';
import EducationLevelSelect from '../inputs/education-level-select';
import { FormAction } from '@repo/form/form-action-state';
import { FormState } from '@repo/form/form-state';
import { firstFieldError } from '@repo/form/form-errors';
import Link from '../link';

export interface ProfileFormProps {
  profilePromise: Promise<UserProfile>;
  handleSubmit: FormAction<ProfileFormInput>;
}

export default function ProfileForm({ profilePromise, handleSubmit }: ProfileFormProps) {
  const t = useTranslations('forms');
  const tCommon = useTranslations('common');
  const profile = use(profilePromise);
  const [formState, formAction, pending] = useActionState<FormState<ProfileFormInput>, FormData>(handleSubmit, {
    success: false,
    valid: true,
    message: '',
    fieldErrors: {},
    values: {
      firstName: profile.firstName ?? '',
      lastName: profile.lastName ?? '',
      educationLevel: profile.educationLevel ?? ''
    }
  });
  const fieldError = (field: keyof ProfileFormInput) => firstFieldError(formState, field);

  return (
    <form action={formAction}>
      <Stack spacing={2}>
        {formState?.message && !pending && (
          <Alert severity={formState?.success ? 'success' : 'error'}>{formState?.message}</Alert>
        )}
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
        <EducationLevelSelect
          defaultValue={formState.values.educationLevel}
          error={Boolean(fieldError('educationLevel'))}
          helperText={fieldError('educationLevel')}
        />
      </Stack>
      <Grid container spacing={2}>
        <Grid>
          <Button variant="outlined" color="secondary" component={Link} href="/">
            {tCommon('actions.back')}
          </Button>
        </Grid>
        <Grid>
          <Button variant="contained" type="submit" disabled={pending}>
            {t('actions.updateProfile')}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}
