'use client';

import { useActionState } from 'react';
import { useTranslations } from 'next-intl';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import PasswordField from './password-field';
import { ChangeEmailFormInput, changeEmailFormSchema } from '@repo/application/forms';
import type { FormAction, FormActionState } from '@repo/form/form-action-state';
import type { FormState } from '@repo/form/form-state';
import { createFormState } from '@repo/form/form-state';
import { createFieldError } from '@repo/form/form-errors';
import { createFormFieldLiveValidation } from '@repo/form/use-form-field-live-validation';
import { useFormActionState } from '@repo/form/use-form-action-state';
import { useFormFieldCrossValidation } from '@repo/form/use-form-field-cross-validation';
import Form from './form';
import FormActions from '../form-actions';
import Stack from '@mui/material/Stack';
import FormAlert from './form-alert';

export type ChangeEmailFormProps = {
  handleSubmit: FormAction<ChangeEmailFormInput>;
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
  const tCommon = useTranslations('common');
  const tRoot = useTranslations();
  const [state, action, isPending, handleSubmitForm, handleRetry] = useFormActionState({
    action: handleSubmit,
    initialState: createFormState<ChangeEmailFormInput>({
      newEmail: defaultEmail ?? '',
      newEmailConfirmation: '',
      currentPassword: ''
    }),
    schema: changeEmailFormSchema,
    translate: tCommon,
    translateFieldError: tRoot
  });

  const useFieldValidation = createFormFieldLiveValidation(changeEmailFormSchema, {
    state,
    t: (key: string) => tRoot(key)
  });
  const newEmail = useFieldValidation('newEmail');
  const currentPassword = useFieldValidation('currentPassword');
  const fieldError = createFieldError<ChangeEmailFormInput>(state);
  const newEmailConfirmation = useFormFieldCrossValidation<ChangeEmailFormInput, 'newEmailConfirmation'>({
    values: {
      ...state.values,
      newEmail: newEmail.value,
      currentPassword: currentPassword.value,
      newEmailConfirmation: state.values.newEmailConfirmation
    },
    field: 'newEmailConfirmation',
    schema: changeEmailFormSchema,
    t: (key: string) => tRoot(key),
    serverError: fieldError('newEmailConfirmation')
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
  const pendingMessage = resendState.message || cancelState.message;

  return (
    <>
      {pendingEmail && (
        <Stack spacing={2}>
          <Alert severity="info">{t('messages.emailChangePending', { email: pendingEmail })}</Alert>
          {pendingMessage && !resendPending && !cancelPending && (
            <Alert severity={resendState.success || cancelState.success ? 'success' : 'error'}>{pendingMessage}</Alert>
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
      <Form action={action} onSubmit={handleSubmitForm}>
        <FormAlert state={state} isPending={isPending} onRetry={handleRetry} />
        <Stack spacing={2}>
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
            label={t('fields.newEmail')}
            placeholder={t('placeholders.newEmail')}
            required
            {...newEmail.fieldProps()}
          />
          <TextField
            name="newEmailConfirmation"
            type="email"
            label={t('fields.newEmailConfirmation')}
            placeholder={t('placeholders.newEmailConfirmation')}
            required
            {...newEmailConfirmation.fieldProps()}
          />
          <PasswordField
            name="currentPassword"
            label={t('fields.currentPassword')}
            placeholder={t('placeholders.currentPassword')}
            required
            autoComplete="current-password"
            showPasswordLabel={t('actions.showPassword')}
            hidePasswordLabel={t('actions.hidePassword')}
            {...currentPassword.fieldProps()}
          />
        </Stack>
        <FormActions>
          <Button variant="contained" type="submit" disabled={isPending}>
            {t('actions.updateEmail')}
          </Button>
        </FormActions>
      </Form>
    </>
  );
}
