'use client';

import { useEffect, useMemo, useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
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
import { useFieldLiveValidation } from '@repo/form/use-field-live-validation';
import type { OpenBadgeRequirementOptionViewModel } from '@repo/application/view-models/open-badge-requirement-option';
import styles from './machine.form.module.css';

type MachineFormValues = MachineCreateFormInput | MachineUpdateFormInput;

export interface MachineFormProps {
  formState: FormActionStateTuple<MachineFormValues>;
  openBadgeOptions: OpenBadgeRequirementOptionViewModel[];
  imagePreviewUrl?: string;
  imageRequired?: boolean;
  backHref?: string;
  submitLabel?: string;
}

export default function MachineForm({
  formState: [state, action, isPending, handleSubmit, handleRetry],
  openBadgeOptions,
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
  const [badgeRequired, setBadgeRequired] = useState(Boolean(state.values.badgeRequired));
  const [selectedOpenBadgeId, setSelectedOpenBadgeId] = useState(state.values.requiredOpenBadgeId ?? '');
  const [selectedOpenBadgeLevelId, setSelectedOpenBadgeLevelId] = useState(state.values.requiredOpenBadgeLevelId ?? '');
  const name = useFieldLiveValidation({
    schema: machineNameSchema,
    value: state.values.name,
    serverError: fieldError('name'),
    t: (key) => tRoot(key)
  });
  const description = useFieldLiveValidation({
    schema: machineDescriptionSchema,
    value: state.values.description,
    serverError: fieldError('description'),
    t: (key) => tRoot(key)
  });
  const badgeRequirementError = fieldError('requiredOpenBadgeId');
  const selectedOpenBadge = useMemo(
    () => openBadgeOptions.find((badge) => badge.id === selectedOpenBadgeId) ?? null,
    [openBadgeOptions, selectedOpenBadgeId]
  );
  const selectedLevelOptions = useMemo(() => selectedOpenBadge?.levels ?? [], [selectedOpenBadge]);

  useEffect(() => {
    setBadgeRequired(Boolean(state.values.badgeRequired));
  }, [state.values.badgeRequired]);

  useEffect(() => {
    setSelectedOpenBadgeId(state.values.requiredOpenBadgeId ?? '');
  }, [state.values.requiredOpenBadgeId]);

  useEffect(() => {
    setSelectedOpenBadgeLevelId(state.values.requiredOpenBadgeLevelId ?? '');
  }, [state.values.requiredOpenBadgeLevelId]);

  useEffect(() => {
    if (!badgeRequired) {
      setSelectedOpenBadgeId('');
      setSelectedOpenBadgeLevelId('');
    }
  }, [badgeRequired]);

  useEffect(() => {
    if (!selectedOpenBadgeId) {
      setSelectedOpenBadgeLevelId('');
      return;
    }

    if (!selectedLevelOptions.some((level) => level.id === selectedOpenBadgeLevelId)) {
      setSelectedOpenBadgeLevelId('');
    }
  }, [selectedLevelOptions, selectedOpenBadgeId, selectedOpenBadgeLevelId]);

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
        <SectionSubtitle>{t('badgeRequirement.title')}</SectionSubtitle>
        <Typography variant="body1" className={styles.sectionDescription}>
          {t('badgeRequirement.description')}
        </Typography>
        <FormControlLabel
          control={
            <Switch
              name="badgeRequired"
              checked={badgeRequired}
              onChange={(_, checked) => setBadgeRequired(checked)}
              slotProps={{
                input: {
                  'aria-label': t('badgeRequirement.toggle')
                }
              }}
            />
          }
          label={t('badgeRequirement.toggle')}
        />
        {badgeRequired ? (
          <>
            <input type="hidden" name="requiredOpenBadgeId" value={selectedOpenBadgeId} />
            <Autocomplete<OpenBadgeRequirementOptionViewModel, false, false, false>
              options={openBadgeOptions}
              value={selectedOpenBadge}
              onChange={(_, nextValue) => {
                setSelectedOpenBadgeId(nextValue?.id ?? '');
                setSelectedOpenBadgeLevelId('');
              }}
              getOptionLabel={(badge) => badge.name}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={t('badgeRequirement.badgeLabel')}
                  error={Boolean(badgeRequirementError)}
                  helperText={badgeRequirementError ?? t('badgeRequirement.badgeHelper')}
                />
              )}
            />

            <FormControl fullWidth>
              <InputLabel id="machine-required-open-badge-level-label">{t('badgeRequirement.levelLabel')}</InputLabel>
              <Select
                labelId="machine-required-open-badge-level-label"
                name="requiredOpenBadgeLevelId"
                value={selectedOpenBadgeLevelId}
                label={t('badgeRequirement.levelLabel')}
                onChange={(event) => setSelectedOpenBadgeLevelId(event.target.value)}
                disabled={!selectedOpenBadge}
              >
                <MenuItem value="">{t('badgeRequirement.anyLevel')}</MenuItem>
                {selectedLevelOptions.map((level) => (
                  <MenuItem key={level.id} value={level.id}>
                    {level.label}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>{t('badgeRequirement.levelHelper')}</FormHelperText>
            </FormControl>
          </>
        ) : null}
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
