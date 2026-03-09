'use client';

import { useTranslations } from 'next-intl';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import {
  ChangePasswordFormInput,
  changePasswordFormSchema,
  passwordConfirmationMatchSchema
} from '@repo/application/forms';
import type { FormAction } from '@repo/form/form-action-state';
import { createFormState } from '@repo/form/form-state';
import { createFieldError } from '@repo/form/form-errors';
import { createFormFieldLiveValidation } from '@repo/form/use-form-field-live-validation';
import { useFormActionState } from '@repo/form/use-form-action-state';
import { useFormFieldCrossValidation } from '@repo/form/use-form-field-cross-validation';
import Form from './form';
import FormActions from '../form-actions';
import FormAlert from './form-alert';

export type ChangePasswordFormProps = {
  handleSubmit: FormAction<ChangePasswordFormInput>;
};

export default function ChangePasswordForm({ handleSubmit }: ChangePasswordFormProps) {
  const t = useTranslations('forms');
  const tRoot = useTranslations();
  const [state, action, isPending, handleSubmitForm, handleRetry] = useFormActionState({
    action: handleSubmit,
    initialState: createFormState<ChangePasswordFormInput>({
      currentPassword: '',
      password: '',
      passwordConfirmation: ''
    }),
    schema: changePasswordFormSchema,
    translate: tRoot,
    translateFieldError: tRoot
  });

  const useFieldValidation = createFormFieldLiveValidation(changePasswordFormSchema, {
    state,
    t: (key: string) => tRoot(key)
  });
  const currentPassword = useFieldValidation('currentPassword');
  const password = useFieldValidation('password');
  const fieldError = createFieldError<ChangePasswordFormInput>(state);
  const passwordConfirmation = useFormFieldCrossValidation<ChangePasswordFormInput, 'passwordConfirmation'>({
    values: {
      ...state.values,
      currentPassword: currentPassword.value,
      password: password.value,
      passwordConfirmation: state.values.passwordConfirmation
    },
    field: 'passwordConfirmation',
    schema: passwordConfirmationMatchSchema,
    t: (key: string) => tRoot(key),
    serverError: fieldError('passwordConfirmation')
  });

  return (
    <Form action={action} onSubmit={handleSubmitForm}>
      <FormAlert state={state} isPending={isPending} onRetry={handleRetry} />
      <Stack spacing={2}>
        <TextField
          name="currentPassword"
          type="password"
          label={t('fields.currentPassword')}
          placeholder={t('placeholders.currentPassword')}
          required
          autoComplete="current-password"
          {...currentPassword.fieldProps()}
        />
        <TextField
          name="password"
          type="password"
          label={t('fields.newPassword')}
          placeholder={t('placeholders.newPassword')}
          required
          autoComplete="new-password"
          {...password.fieldProps()}
        />
        <TextField
          name="passwordConfirmation"
          type="password"
          label={t('fields.newPasswordConfirmation')}
          placeholder={t('placeholders.newPasswordConfirmation')}
          required
          autoComplete="new-password"
          {...passwordConfirmation.fieldProps()}
        />
      </Stack>
      <FormActions>
        <Button variant="contained" type="submit" disabled={isPending}>
          {t('actions.updatePassword')}
        </Button>
      </FormActions>
    </Form>
  );
}
