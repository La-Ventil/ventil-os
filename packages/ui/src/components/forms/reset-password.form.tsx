'use client';

import { useTranslations } from 'next-intl';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { ResetPasswordFormInput } from '@repo/application/forms';
import { FormActionState } from '../../form-action-state';
import { useFormActionStateWithValues } from '../../hooks';

export interface ResetPasswordFormProps {
  handleSubmit: FormActionState<ResetPasswordFormInput>;
}

export default function ResetPasswordForm({ handleSubmit }: ResetPasswordFormProps) {
  const t = useTranslations('forms');
  const tCommon = useTranslations('common');
  const [formState, formAction, pending] = useFormActionStateWithValues<ResetPasswordFormInput>(handleSubmit, {
    success: false,
    valid: true,
    message: '',
    fieldErrors: {},
    values: {
      email: ''
    }
  });

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
