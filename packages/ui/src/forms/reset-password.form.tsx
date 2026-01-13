'use client';

import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import { useTranslations } from 'next-intl';
import { ResetPasswordFormData } from '@repo/domain/models/forms/reset-password-form-data';
import { FormActionState } from '../form-action-state';
import { useFormActionStateWithValues } from '../hooks';

export interface ResetPasswordForm {
  handleSubmit: FormActionState<ResetPasswordFormData>;
}

export default function ResetPasswordForm({ handleSubmit }: ResetPasswordForm) {
  const t = useTranslations('forms');
  const tCommon = useTranslations('common');
  const [formState, formAction, pending] = useFormActionStateWithValues<ResetPasswordFormData>(handleSubmit, {
    message: undefined,
    fieldErrors: {},
    values: {
      email: ''
    },
    isValid: undefined
  });

  return (
    <form action={formAction}>
      {formState?.message && !pending && (
        <Alert severity={formState?.isValid ? 'success' : 'error'}>{formState?.message}</Alert>
      )}
      <Stack spacing={2}>
        <TextField
          name={'email'}
          defaultValue={formState.values.email}
          label={t('fields.email')}
          placeholder={t('placeholders.email')}
          required
        />
      </Stack>
      <Grid container spacing={2}>
        <Grid>
          <Button variant="outlined" color="secondary">
            {tCommon('actions.back')}
          </Button>
        </Grid>
        <Grid>
          <Button variant="contained" type="submit" disabled={pending}>
            {t('actions.submitResetPassword')}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}
