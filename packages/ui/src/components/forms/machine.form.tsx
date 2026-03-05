'use client';

import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import {
  IMAGE_UPLOAD_MAX_MB,
  MachineCreateFormInput,
  MachineUpdateFormInput,
  machineNameSchema,
  machineDescriptionSchema
} from '@repo/application/forms';
import SectionSubtitle from '../section-subtitle';
import AdminButton from '../admin/admin-button';
import ImageUploadField from '../inputs/image-upload-field';
import FormActions from '../form-actions';
import FormSection from '../form-section';
import { FormActionStateTuple } from '@repo/form/use-form-action-state';
import { fieldErrorMessage } from '@repo/form/form-errors';
import FormAlert from './form-alert';
import Form from './form';
import { useZodLiveValidation } from '@repo/form/use-zod-live-validation';
import styles from './machine.form.module.css';

type MachineFormValues = MachineCreateFormInput | MachineUpdateFormInput;

export interface MachineFormProps {
  formState: FormActionStateTuple<MachineFormValues>;
  imagePreviewUrl?: string;
  imageRequired?: boolean;
  backHref?: string;
  submitLabel?: string;
}

export default function MachineForm({
  formState: [state, action, isPending, handleSubmit, handleRetry],
  imagePreviewUrl,
  imageRequired = false,
  backHref = '/hub/admin/machines',
  submitLabel
}: MachineFormProps) {
  const t = useTranslations('pages.hub.admin.machineForm');
  const tRoot = useTranslations();
  const fieldError = (field: keyof MachineCreateFormInput) => fieldErrorMessage(state, field);
  const machineId = 'id' in state.values ? (state.values as MachineUpdateFormInput).id : undefined;
  const maxImageMb = IMAGE_UPLOAD_MAX_MB;
  const name = useZodLiveValidation({
    schema: machineNameSchema,
    value: state.values.name,
    serverError: fieldError('name'),
    t: (key) => tRoot(key)
  });
  const description = useZodLiveValidation({
    schema: machineDescriptionSchema,
    value: state.values.description,
    serverError: fieldError('description'),
    t: (key) => tRoot(key)
  });

  return (
    <Form action={action} onSubmit={handleSubmit}>
      {machineId ? <input type="hidden" name="id" defaultValue={machineId} /> : null}
      <FormAlert state={state} isPending={isPending} onRetry={handleRetry} />
      <FormSection>
        <TextField name="name" {...name.fieldProps()} label={t('fields.name')} required fullWidth />
        <TextField
          name="description"
          {...description.fieldProps()}
          label={t('fields.description')}
          required
          fullWidth
        />

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
