'use client';

import { useActionState } from 'react';
import { useTranslations } from 'next-intl';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import type { ChangeEmailFormInput } from '@repo/application/forms';
import type { FormActionState } from '@repo/form/form-action-state';
import type { FormState } from '@repo/form/form-state';
import { createFormState } from '@repo/form/form-state';
import { firstFieldError } from '@repo/form/form-errors';
import Form from './form';
import FormActions from '../form-actions';
import Stack from '@mui/material/Stack';

export type ChangeEmailFormProps = {
  handleSubmit: FormActionState<ChangeEmailFormInput>;
  defaultEmail?: string | null;
  pendingEmail?: string | null;
  resendEmailChange: FormActionState<Record<string, never>>;
  cancelEmailChange: FormActionState<Record<string, never>>;
};

export default function ChangeEmailForm({
  handleSubmit,
  defaultEmail,
  pendingEmail,
  resendEmailChange,
  cancelEmailChange
}: ChangeEmailFormProps) {
  const t = useTranslations('forms');
  const [formState, formAction, pending] = useActionState<FormState<ChangeEmailFormInput>, FormData>(handleSubmit, {
    success: false,
    valid: true,
    message: '',
    fieldErrors: {},
    values: {
      newEmail: defaultEmail ?? '',
      newEmailConfirmation: '',
      currentPassword: ''
    }
  });
  const emptyState = createFormState<Record<string, never>>({});
  const [resendState, resendAction, resendPending] = useActionState<FormState<Record<string, never>>, FormData>(
    resendEmailChange,
    emptyState
  );
  const [cancelState, cancelAction, cancelPending] = useActionState<FormState<Record<string, never>>, FormData>(
    cancelEmailChange,
    emptyState
  );
  const fieldError = (field: keyof ChangeEmailFormInput) => firstFieldError(formState, field);
  const pendingMessage = resendState.message || cancelState.message;

  return (
    <>
      {pendingEmail && (
        <Stack spacing={2}>
          <Alert severity="info">
            {t('messages.emailChangePending', { email: pendingEmail })}
          </Alert>
          {pendingMessage && !resendPending && !cancelPending && (
            <Alert severity={resendState.success || cancelState.success ? 'success' : 'error'}>
              {pendingMessage}
            </Alert>
          )}
          <Stack direction="row" spacing={2}>
            <form action={resendAction}>
              <Button variant="outlined" type="submit" disabled={resendPending}>
                {t('actions.resendEmailVerification')}
              </Button>
            </form>
            <form action={cancelAction}>
              <Button variant="text" type="submit" disabled={cancelPending}>
                {t('actions.cancelEmailChange')}
              </Button>
            </form>
          </Stack>
        </Stack>
      )}
      <Form action={formAction}>
        {formState?.message && !pending && (
          <Alert severity={formState?.success ? 'success' : 'error'}>{formState?.message}</Alert>
        )}
        <TextField
          name="currentEmail"
          type="email"
          value={defaultEmail ?? ''}
          label={t('fields.currentEmail')}
          placeholder={t('placeholders.currentEmail')}
          disabled
          InputProps={{ readOnly: true }}
        />
        <TextField
          name="newEmail"
          type="email"
          defaultValue={formState.values.newEmail}
          label={t('fields.newEmail')}
          placeholder={t('placeholders.newEmail')}
          required
          error={Boolean(fieldError('newEmail'))}
          helperText={fieldError('newEmail')}
        />
        <TextField
          name="newEmailConfirmation"
          type="email"
          defaultValue={formState.values.newEmailConfirmation}
          label={t('fields.newEmailConfirmation')}
          placeholder={t('placeholders.newEmailConfirmation')}
          required
          error={Boolean(fieldError('newEmailConfirmation'))}
          helperText={fieldError('newEmailConfirmation')}
        />
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
        <FormActions>
          <Button variant="contained" type="submit" disabled={pending}>
            {t('actions.updateEmail')}
          </Button>
        </FormActions>
      </Form>
    </>
  );
}
