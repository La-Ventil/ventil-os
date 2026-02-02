'use client';

import { useActionState } from 'react';
import { useTranslations } from 'next-intl';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { ResetPasswordFormInput } from '@repo/application/forms';
import { FormActionState } from '@repo/form/form-action-state';
import { FormState } from '@repo/form/form-state';
import { firstFieldError } from '@repo/form/form-errors';

export interface ResetPasswordFormProps {
  handleSubmit: FormActionState<ResetPasswordFormInput>;
}

export default function ResetPasswordForm({ handleSubmit }: ResetPasswordFormProps) {
  const t = useTranslations('forms');
  const tCommon = useTranslations('common');
  const [formState, formAction, pending] = useActionState<FormState<ResetPasswordFormInput>, FormData>(handleSubmit, {
    success: false,
    valid: true,
    message: '',
    fieldErrors: {},
    values: {
      email: ''
    }
  });
  const fieldError = (field: keyof ResetPasswordFormInput) => firstFieldError(formState, field);

  return (
    <form action={formAction}>
      {formState?.message && !pending && (
        <Alert severity={formState?.success ? 'success' : 'error'}>{formState?.message}</Alert>
      )}
      <Stack spacing={2}>
        <TextField
          name={'email'}
          defaultValue={formState.values.email}
          label={t('fields.email')}
          placeholder={t('placeholders.email')}
          required
          error={Boolean(fieldError('email'))}
          helperText={fieldError('email')}
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
