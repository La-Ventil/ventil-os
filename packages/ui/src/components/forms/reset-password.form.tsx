'use client';

import { useTranslations } from 'next-intl';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { ResetPasswordFormInput, resetPasswordFormSchema } from '@repo/application/forms';
import { createFormState } from '@repo/form/form-state';
import { useFormActionState } from '@repo/form/use-form-action-state';
import { createFormFieldLiveValidation } from '@repo/form/use-form-field-live-validation';
import Form from './form';
import FormActions from '../form-actions';
import FormAlert from './form-alert';
import Link from '../link';
import type { FormAction } from '@repo/form/form-action-state';

export interface ResetPasswordFormProps {
  handleSubmit: FormAction<ResetPasswordFormInput>;
}

export default function ResetPasswordForm({ handleSubmit }: ResetPasswordFormProps) {
  const t = useTranslations('forms');
  const tCommon = useTranslations('common');
  const tRoot = useTranslations();
  const [state, action, isPending, handleSubmitForm, handleRetry] = useFormActionState({
    action: handleSubmit,
    initialState: createFormState<ResetPasswordFormInput>({
      email: ''
    }),
    schema: resetPasswordFormSchema,
    translate: tCommon,
    translateFieldError: tRoot
  });

  const useEmailValidation = createFormFieldLiveValidation(resetPasswordFormSchema, {
    state,
    t: (key: string) => tRoot(key)
  });

  const email = useEmailValidation('email');

  return (
    <Form action={action} onSubmit={handleSubmitForm}>
      <FormAlert state={state} isPending={isPending} onRetry={handleRetry} />
      <Stack spacing={2}>
        <TextField
          name={'email'}
          label={t('fields.email')}
          placeholder={t('placeholders.email')}
          required
          {...email.fieldProps()}
        />
      </Stack>
      <FormActions>
        <Button variant="outlined" color="secondary" component={Link} href="/login">
          {tCommon('actions.back')}
        </Button>
        <Button variant="contained" type="submit" disabled={isPending}>
          {t('actions.submitResetPassword')}
        </Button>
      </FormActions>
    </Form>
  );
}
