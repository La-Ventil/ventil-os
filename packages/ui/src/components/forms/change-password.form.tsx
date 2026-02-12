'use client';

import { useActionState } from 'react';
import { useTranslations } from 'next-intl';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import type { ChangePasswordFormInput } from '@repo/application/forms';
import type { FormActionState } from '@repo/form/form-action-state';
import type { FormState } from '@repo/form/form-state';
import { firstFieldError } from '@repo/form/form-errors';
import Form from './form';
import FormActions from '../form-actions';

export type ChangePasswordFormProps = {
  handleSubmit: FormActionState<ChangePasswordFormInput>;
};

export default function ChangePasswordForm({ handleSubmit }: ChangePasswordFormProps) {
  const t = useTranslations('forms');
  const [formState, formAction, pending] = useActionState<FormState<ChangePasswordFormInput>, FormData>(handleSubmit, {
    success: false,
    valid: true,
    message: '',
    fieldErrors: {},
    values: {
      currentPassword: '',
      password: '',
      passwordConfirmation: ''
    }
  });
  const fieldError = (field: keyof ChangePasswordFormInput) => firstFieldError(formState, field);

  return (
    <Form action={formAction}>
      {formState?.message && !pending && (
        <Alert severity={formState?.success ? 'success' : 'error'}>{formState?.message}</Alert>
      )}
      <TextField
        name="currentPassword"
        type="password"
        defaultValue={formState.values.currentPassword}
        label={t('fields.currentPassword')}
        placeholder={t('placeholders.currentPassword')}
        required
        autoComplete="current-password"
        error={Boolean(fieldError('currentPassword'))}
        helperText={fieldError('currentPassword')}
      />
      <TextField
        name="password"
        type="password"
        defaultValue={formState.values.password}
        label={t('fields.newPassword')}
        placeholder={t('placeholders.newPassword')}
        required
        autoComplete="new-password"
        error={Boolean(fieldError('password'))}
        helperText={fieldError('password')}
      />
      <TextField
        name="passwordConfirmation"
        type="password"
        defaultValue={formState.values.passwordConfirmation}
        label={t('fields.newPasswordConfirmation')}
        placeholder={t('placeholders.newPasswordConfirmation')}
        required
        autoComplete="new-password"
        error={Boolean(fieldError('passwordConfirmation'))}
        helperText={fieldError('passwordConfirmation')}
      />
      <FormActions>
        <Button variant="contained" type="submit" disabled={pending}>
          {t('actions.updatePassword')}
        </Button>
      </FormActions>
    </Form>
  );
}
