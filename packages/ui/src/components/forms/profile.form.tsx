'use client';

import { use } from 'react';
import { useTranslations } from 'next-intl';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { ProfileFormInput, buildProfileFormSchema } from '@repo/application/forms';
import { UserProfile } from '@repo/application/users/models/user-profile';
import EducationLevelSelect from '../inputs/education-level-select';
import { createFormState } from '@repo/form/form-state';
import { createFormFieldLiveValidation } from '@repo/form/use-form-field-live-validation';
import { useFormActionState } from '@repo/form/use-form-action-state';
import { createFieldError } from '@repo/form/form-errors';
import type { FormAction } from '@repo/form/form-action-state';
import Link from '../link';
import Form from './form';
import FormActions from '../form-actions';
import FormAlert from './form-alert';
import { useProfileEducation } from '../../hooks/use-profile-education';
import { useFieldState } from '@repo/form/use-field-state';

export interface ProfileFormProps {
  profilePromise: Promise<UserProfile>;
  handleSubmit: FormAction<ProfileFormInput>;
  userId?: string;
  backHref?: string;
}

export default function ProfileForm({ profilePromise, handleSubmit, userId, backHref = '/' }: ProfileFormProps) {
  const t = useTranslations('forms');
  const tCommon = useTranslations('common');
  const tRoot = useTranslations();
  const profile = use(profilePromise);
  const formSchema = buildProfileFormSchema(profile.profile);
  const [state, action, isPending, handleSubmitForm, handleRetry] = useFormActionState({
    action: handleSubmit,
    initialState: createFormState<ProfileFormInput>({
      firstName: profile.firstName ?? '',
      lastName: profile.lastName ?? '',
      educationLevel: profile.educationLevel ?? ''
    }),
    schema: formSchema,
    translate: tCommon,
    translateFieldError: tRoot
  });
  const fieldError = createFieldError<ProfileFormInput>(state);
  const useFieldValidation = createFormFieldLiveValidation(formSchema, {
    state,
    t: (key: string) => tRoot(key)
  });
  const firstName = useFieldValidation('firstName');
  const lastName = useFieldValidation('lastName');
  const educationLevel = useFieldState<string>({
    value: state.values.educationLevel ?? ''
  });
  const { showEducationLevel, resolvedEducationLevel } = useProfileEducation({
    profile: profile.profile,
    educationLevel: educationLevel.value
  });

  return (
    <Form action={action} onSubmit={handleSubmitForm}>
      <FormAlert state={state} isPending={isPending} onRetry={handleRetry} />
      {userId ? <input type="hidden" name="userId" value={userId} /> : null}
      <Stack spacing={2}>
        <TextField
          name="firstName"
          label={t('fields.firstName')}
          placeholder={t('placeholders.firstName')}
          required
          {...firstName.fieldProps()}
        />
        <TextField
          name="lastName"
          label={t('fields.lastName')}
          placeholder={t('placeholders.lastName')}
          required
          {...lastName.fieldProps()}
        />
        {showEducationLevel ? (
          <EducationLevelSelect
            value={resolvedEducationLevel}
            onChange={educationLevel.setValue}
            error={Boolean(fieldError('educationLevel'))}
            helperText={fieldError('educationLevel')}
          />
        ) : null}
      </Stack>
      <FormActions>
        <Button variant="outlined" color="secondary" component={Link} href={backHref}>
          {tCommon('actions.back')}
        </Button>
        <Button variant="contained" type="submit" disabled={isPending}>
          {t('actions.updateProfile')}
        </Button>
      </FormActions>
    </Form>
  );
}
