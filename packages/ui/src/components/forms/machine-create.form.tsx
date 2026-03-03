'use client';

import Divider from '@mui/material/Divider';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import {
  IMAGE_UPLOAD_MAX_MB,
  MachineCreateFormInput,
  MachineUpdateFormInput,
  MACHINE_DESCRIPTION_MAX_LENGTH,
  MACHINE_NAME_MAX_LENGTH
} from '@repo/application/forms';
import SectionSubtitle from '../section-subtitle';
import AdminButton from '../admin/admin-button';
import ImageUploadField from '../inputs/image-upload-field';
import FormActions from '../form-actions';
import FormSection from '../form-section';
import { FormActionStateTuple } from '@repo/form/use-form-action-state';
import { fieldErrorMessage } from '@repo/form/form-errors';
import { createFormState } from '@repo/form/form-state';
import FormAlert from './form-alert';
import Form from './form';
import { useEffect, useState } from 'react';
import styles from './machine-create.form.module.css';

type MachineFormValues = MachineCreateFormInput | MachineUpdateFormInput;

export interface MachineCreateFormProps {
  formState: FormActionStateTuple<MachineFormValues>;
  imagePreviewUrl?: string;
  imageRequired?: boolean;
  backHref?: string;
  submitLabel?: string;
}

export const machineCreateInitialState = createFormState<MachineCreateFormInput>({
  name: '',
  description: '',
  imageFile: undefined,
  badgeRequired: true,
  badgeQuery: '',
  activationEnabled: true
});

export default function MachineCreateForm({
  formState: [state, action, isPending, handleSubmit, handleRetry],
  imagePreviewUrl,
  imageRequired = false,
  backHref = '/hub/admin/machines',
  submitLabel
}: MachineCreateFormProps) {
  const t = useTranslations('pages.hub.admin.machinesCreate');
  const tRoot = useTranslations();
  const fieldError = (field: keyof MachineCreateFormInput) => fieldErrorMessage(state, field);
  const machineId = 'id' in state.values ? (state.values as MachineUpdateFormInput).id : undefined;
  const maxImageMb = IMAGE_UPLOAD_MAX_MB;
  const [name, setName] = useState(state.values.name);
  const [description, setDescription] = useState(state.values.description);
  const [nameTouched, setNameTouched] = useState(false);
  const [descriptionTouched, setDescriptionTouched] = useState(false);
  const nameErrors = validateMachineNameErrors(name, nameTouched, {
    required: tRoot('validation.machine.nameRequired'),
    maxLength: tRoot('validation.machine.nameMaxLength')
  });
  const descriptionErrors = validateMachineDescriptionErrors(description, descriptionTouched, {
    required: tRoot('validation.machine.descriptionRequired'),
    maxLength: tRoot('validation.machine.descriptionMaxLength')
  });

  useEffect(() => {
    setName(state.values.name);
  }, [state.values.name]);

  useEffect(() => {
    setDescription(state.values.description);
  }, [state.values.description]);

  return (
    <Form action={action} onSubmit={handleSubmit}>
      {machineId ? <input type="hidden" name="id" defaultValue={machineId} /> : null}
      <FormAlert state={state} isPending={isPending} onRetry={handleRetry} />
      <FormSection>
        <TextField
          name="name"
          value={name}
          onChange={(event) => setName(event.currentTarget.value)}
          onBlur={() => setNameTouched(true)}
          label={t('fields.name')}
          required
          fullWidth
          error={Boolean(nameErrors.length || fieldError('name'))}
          helperText={nameErrors.length ? nameErrors.join(' ') : fieldError('name')}
        />
        <TextField
          name="description"
          value={description}
          onChange={(event) => setDescription(event.currentTarget.value)}
          onBlur={() => setDescriptionTouched(true)}
          label={t('fields.description')}
          required
          fullWidth
          error={Boolean(descriptionErrors.length || fieldError('description'))}
          helperText={descriptionErrors.length ? descriptionErrors.join(' ') : fieldError('description')}
        />

        <div className={styles.imageRow}>
          <ImageUploadField
            label={t('fields.image')}
            placeholder={t('image.placeholder')}
            uploadLabel={t('image.upload')}
            maxSizeHint={t('image.maxSizeHint')}
            tooLargeLabel={t('image.tooLarge', { max: `${maxImageMb}MB` })}
            clearLabel={t('image.clear')}
            maxSizeMb={maxImageMb}
            resetKey={state.success ? 'reset' : undefined}
            required={imageRequired}
            previewUrl={imagePreviewUrl}
            error={Boolean(fieldError('imageFile'))}
            helperText={fieldError('imageFile')}
          />
        </div>
      </FormSection>

      <FormSection>
        <SectionSubtitle>{t('activation.title')}</SectionSubtitle>
        <Typography variant="body1" className={styles.sectionDescription}>
          {t('activation.description')}
        </Typography>
        <Switch
          name="activationEnabled"
          defaultChecked={state.values.activationEnabled}
          slotProps={{
            input: {
              'aria-label': t('activation.title')
            }
          }}
        />
      </FormSection>

      <FormActions>
        <AdminButton variant="outlined" component={Link} href={backHref}>
          {t('actions.back')}
        </AdminButton>
        <AdminButton variant="contained" type="submit" disabled={isPending}>
          {submitLabel ?? t('actions.save')}
        </AdminButton>
      </FormActions>
    </Form>
  );
}

const validateMachineNameErrors = (
  value: string,
  touched: boolean,
  messages: { required: string; maxLength: string }
): string[] => {
  const errors: string[] = [];

  if (touched && value.length === 0) {
    errors.push(messages.required);
  }

  if (value.length > MACHINE_NAME_MAX_LENGTH) {
    errors.push(messages.maxLength);
  }

  return errors;
};

const validateMachineDescriptionErrors = (
  value: string,
  touched: boolean,
  messages: { required: string; maxLength: string }
): string[] => {
  const errors: string[] = [];

  if (touched && value.length === 0) {
    errors.push(messages.required);
  }

  if (value.length > MACHINE_DESCRIPTION_MAX_LENGTH) {
    errors.push(messages.maxLength);
  }

  return errors;
};
