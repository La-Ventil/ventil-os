'use client';

import Divider from '@mui/material/Divider';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Link from 'next/link';
import Stack from '@mui/material/Stack';
import { useTranslations } from 'next-intl';
import { MachineCreateFormInput, MachineUpdateFormInput } from '@repo/application/forms';
import SectionSubtitle from '../section-subtitle';
import AdminButton from '../admin/admin-button';
import ImageUploadField from '../inputs/image-upload-field';
import FormActions from '../form-actions';
import FormSection from '../form-section';
import { FormActionStateTuple } from '@repo/form/use-form-action-state';
import { firstFieldError } from '@repo/form/form-errors';
import { createFormState } from '@repo/form/form-state';
import FormAlert from './form-alert';
import Form from './form';
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
  imageRequired = true,
  backHref = '/hub/admin/machines',
  submitLabel
}: MachineCreateFormProps) {
  const t = useTranslations('pages.hub.admin.machinesCreate');
  const fieldError = (field: keyof MachineCreateFormInput) => firstFieldError(state, field);
  const machineId = 'id' in state.values ? (state.values as MachineUpdateFormInput).id : undefined;

  return (
    <Form action={action} onSubmit={handleSubmit}>
      {machineId ? <input type="hidden" name="id" defaultValue={machineId} /> : null}
      <FormAlert state={state} isPending={isPending} onRetry={handleRetry} />
      <FormSection>
        <TextField
          name="name"
          defaultValue={state.values.name}
          label={t('fields.name')}
          required
          fullWidth
          error={Boolean(fieldError('name'))}
          helperText={fieldError('name')}
        />
        <TextField
          name="description"
          defaultValue={state.values.description}
          label={t('fields.description')}
          required
          fullWidth
          error={Boolean(fieldError('description'))}
          helperText={fieldError('description')}
        />

        <div className={styles.imageRow}>
          <ImageUploadField
            label={t('fields.image')}
            placeholder={t('image.placeholder')}
            uploadLabel={t('image.upload')}
            maxSizeHint={t('image.maxSizeHint')}
            tooLargeLabel={t('image.tooLarge')}
            clearLabel={t('image.clear')}
            maxSizeMb={5}
            resetKey={state.success ? 'reset' : undefined}
            required={imageRequired}
            previewUrl={imagePreviewUrl}
            error={Boolean(fieldError('imageFile'))}
            helperText={fieldError('imageFile')}
          />
        </div>
      </FormSection>

      <Divider />

      <FormSection>
        <SectionSubtitle>{t('badgeRequirement.title')}</SectionSubtitle>
        <Typography variant="body1" className={styles.sectionDescription}>
          {t('badgeRequirement.description')}
        </Typography>
        <Switch name="badgeRequired" defaultChecked={state.values.badgeRequired} />
        <Stack spacing={2}>
          <TextField
            name="badgeQuery"
            defaultValue={state.values.badgeQuery}
            label={t('badgeRequirement.searchLabel')}
            placeholder={t('badgeRequirement.searchPlaceholder')}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              )
            }}
          />
          <div className={styles.badgeCard}>
            <div className={styles.badgeIllustration}>{t('image.placeholder')}</div>
            <Stack spacing={0.5}>
              <Typography className={styles.badgeType}>{t('badgeRequirement.badgeType')}</Typography>
              <Typography className={styles.badgeName}>{t('badgeRequirement.badgeName')}</Typography>
            </Stack>
            <IconButton aria-label={t('badgeRequirement.removeLabel')}>
              <CloseIcon />
            </IconButton>
          </div>
        </Stack>
      </FormSection>

      <Divider />

      <FormSection>
        <SectionSubtitle>{t('activation.title')}</SectionSubtitle>
        <Typography variant="body1" className={styles.sectionDescription}>
          {t('activation.description')}
        </Typography>
        <Switch name="activationEnabled" defaultChecked={state.values.activationEnabled} />
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
