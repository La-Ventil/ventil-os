'use client';

import { use, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Radio from '@mui/material/Radio';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import {
  AdminAccessLevel,
  AdminUserEditFormInput,
  buildAdminUserEditFormSchema,
  resolveAdminAccessLevel
} from '@repo/application/forms';
import { UserProfile } from '@repo/application/users/models/user-profile';
import EducationLevelSelect from '../inputs/education-level-select';
import ProfileRadioGroup from '../inputs/profile-radio-group';
import type { FormAction } from '@repo/form/form-action-state';
import { createFormState } from '@repo/form/form-state';
import { createFieldError } from '@repo/form/form-errors';
import { createFormFieldLiveValidation } from '@repo/form/use-form-field-live-validation';
import { useFormActionState } from '@repo/form/use-form-action-state';
import Form from './form';
import FormActions from '../form-actions';
import FormAlert from './form-alert';
import { useProfileEducation } from '../../hooks/use-profile-education';
import { useFieldState } from '@repo/form/use-field-state';
import { FormLabel } from '../form-label';
import { RadioGroup } from '../inputs/radio-group';

export interface AdminUserEditFormProps {
  profilePromise: Promise<UserProfile>;
  handleSubmit: FormAction<AdminUserEditFormInput>;
  userId: string;
  currentUserId: string;
  onSuccess?: () => void;
}

export default function AdminUserEditForm({
  profilePromise,
  handleSubmit,
  userId,
  currentUserId,
  onSuccess
}: AdminUserEditFormProps) {
  const t = useTranslations('forms');
  const tCommon = useTranslations('common');
  const tRoot = useTranslations();
  const tPage = useTranslations('pages.hub.admin.usersEdit');
  const profile = use(profilePromise);
  const formSchema = buildAdminUserEditFormSchema();
  const isEditingOwnAccount = currentUserId === userId;

  const [state, action, isPending, handleSubmitForm, handleRetry] = useFormActionState({
    action: handleSubmit,
    initialState: createFormState<AdminUserEditFormInput>({
      firstName: profile.firstName ?? '',
      lastName: profile.lastName,
      profile: profile.profile,
      educationLevel: profile.educationLevel ?? '',
      adminAccessLevel: resolveAdminAccessLevel(profile)
    }),
    schema: formSchema,
    translate: tCommon,
    translateFieldError: tRoot
  });

  const fieldError = createFieldError<AdminUserEditFormInput>(state);
  const useFieldValidation = createFormFieldLiveValidation(formSchema, {
    state,
    t: (key: string) => tRoot(key)
  });

  const firstName = useFieldValidation('firstName');
  const lastName = useFieldValidation('lastName');
  const profileField = useFieldState<string>({ value: String(state.values.profile) });
  const adminAccessLevelField = useFieldState<string>({
    value: String(state.values.adminAccessLevel ?? AdminAccessLevel.None)
  });
  const educationLevel = useFieldState<string>({
    value: state.values.educationLevel ?? ''
  });

  const { showEducationLevel, resolvedEducationLevel } = useProfileEducation({
    profile: profileField.value,
    educationLevel: educationLevel.value
  });

  useEffect(() => {
    if (state.success) {
      onSuccess?.();
    }
  }, [state.success, onSuccess]);

  return (
    <Form action={action} onSubmit={handleSubmitForm}>
      <FormAlert state={state} isPending={isPending} onRetry={handleRetry} />
      <input type="hidden" name="userId" value={userId} />
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
        <ProfileRadioGroup
          value={profileField.value}
          error={Boolean(fieldError('profile'))}
          helperText={fieldError('profile')}
          onChange={(value) => {
            profileField.setValue(value);
          }}
        />
        <FormControl error={Boolean(fieldError('adminAccessLevel'))}>
          <FormLabel id="admin-access-level-label">{tPage('adminAccess.title')}</FormLabel>
          <FormHelperText>{tPage('adminAccess.description')}</FormHelperText>
          <RadioGroup
            aria-labelledby="admin-access-level-label"
            name="adminAccessLevel"
            value={adminAccessLevelField.value}
            onChange={(event) => {
              adminAccessLevelField.setValue(String(event.target.value));
            }}
          >
            <FormControlLabel
              value={AdminAccessLevel.None}
              control={<Radio />}
              disabled={isEditingOwnAccount}
              label={tPage('adminAccess.options.none')}
            />
            <FormControlLabel
              value={AdminAccessLevel.Pedagogical}
              control={<Radio />}
              disabled={isEditingOwnAccount}
              label={tPage('adminAccess.options.pedagogical')}
            />
            <FormControlLabel
              value={AdminAccessLevel.Global}
              control={<Radio />}
              disabled={isEditingOwnAccount}
              label={tPage('adminAccess.options.global')}
            />
          </RadioGroup>
          {isEditingOwnAccount ? <FormHelperText>{tPage('adminAccess.lockedForSelf')}</FormHelperText> : null}
          {fieldError('adminAccessLevel') ? <FormHelperText>{fieldError('adminAccessLevel')}</FormHelperText> : null}
        </FormControl>
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
        <Button variant="contained" type="submit" disabled={isPending}>
          {t('actions.updateProfile')}
        </Button>
      </FormActions>
    </Form>
  );
}
