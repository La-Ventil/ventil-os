'use client';

import { use } from 'react';
import { useTranslations } from 'next-intl';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { ProfileFormInput } from '@repo/application/forms';
import { UserProfile } from '@repo/view-models/user-profile';
import EducationLevelSelect from '../inputs/education-level-select';
import { FormAction } from '../../form-action-state';
import { useFormActionStateWithValues } from '../../hooks';
import Link from '../link';

export interface ProfileFormProps {
  profilePromise: Promise<UserProfile>;
  handleSubmit: FormAction<ProfileFormInput>;
}

export default function ProfileForm({ profilePromise, handleSubmit }: ProfileFormProps) {
  const t = useTranslations('forms');
  const tCommon = useTranslations('common');
  const profile = use(profilePromise);
  const [formState, formAction, pending] = useFormActionStateWithValues<ProfileFormInput>(handleSubmit, {
    message: '',
    fieldErrors: {},
    values: {
      firstName: profile.firstName ?? '',
      lastName: profile.lastName ?? '',
      educationLevel: profile.educationLevel ?? ''
    },
    isValid: undefined
  });

  return (
    <form action={formAction}>
      <Stack spacing={2}>
        {formState?.message && !pending && (
          <Alert severity={formState?.isValid ? 'success' : 'error'}>{formState?.message}</Alert>
        )}
        <TextField
          name="firstName"
          defaultValue={formState.values.firstName}
          label={t('fields.firstName')}
          placeholder={t('placeholders.firstName')}
          required
        />
        <TextField
          name="lastName"
          defaultValue={formState.values.lastName}
          label={t('fields.lastName')}
          placeholder={t('placeholders.lastName')}
          required
        />
        <EducationLevelSelect defaultValue={formState.values.educationLevel} />
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
