'use client';

import Divider from '@mui/material/Divider';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Link from 'next/link';
import Stack from '@mui/material/Stack';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';
import { OpenBadgeCreateRequest } from '@repo/application/forms';
import SectionSubtitle from '../section-subtitle';
import AdminButton from '../admin/admin-button';
import ImageUploadField from '../inputs/image-upload-field';
import OpenBadgeLevelsEditor from './open-badge-levels-editor';
import FormActions from '../form-actions';
import FormSection from '../form-section';
import { FormActionStateTuple } from '@repo/form/use-form-action-state';
import { createFormState } from '@repo/form/form-state';
import { firstFieldError } from '@repo/form/form-errors';
import FormAlert from './form-alert';
import Form from './form';
import styles from './open-badge-create.form.module.css';

export interface OpenBadgeCreateFormProps {
  formState: FormActionStateTuple<OpenBadgeCreateRequest>;
  badgeId?: string;
  imagePreviewUrl?: string | null;
}

export const openBadgeCreateInitialState = createFormState<OpenBadgeCreateRequest>({
  name: '',
  description: '',
  imageFile: undefined,
  levels: [
    {
      title: '',
      description: ''
    }
  ],
  deliveryEnabled: true,
  deliveryLevel: 'level-1',
  activationEnabled: true
});

export default function OpenBadgeCreateForm({
  formState: [state, action, isPending, handleSubmit, handleRetry],
  badgeId,
  imagePreviewUrl
}: OpenBadgeCreateFormProps) {
  const t = useTranslations('pages.hub.admin.openBadgesCreate');
  const fieldError = (field: keyof OpenBadgeCreateRequest) => firstFieldError(state, field);
  const isEdit = Boolean(badgeId);
  const [deliveryEnabled, setDeliveryEnabled] = useState(state.values.deliveryEnabled);
  const [deliveryLevel, setDeliveryLevel] = useState(state.values.deliveryLevel || 'level-1');
  const initialLevels = useMemo(
    () => (state.values.levels && state.values.levels.length ? state.values.levels : [{ title: '', description: '' }]),
    [state.values.levels]
  );
  const [levelsCount, setLevelsCount] = useState(initialLevels.length);

  useEffect(() => {
    setLevelsCount(initialLevels.length);
  }, [initialLevels]);

  useEffect(() => {
    setDeliveryEnabled(state.values.deliveryEnabled);
  }, [state.values.deliveryEnabled]);

  useEffect(() => {
    setDeliveryLevel(state.values.deliveryLevel || 'level-1');
  }, [state.values.deliveryLevel]);

  const deliveryOptions = useMemo(
    () =>
      Array.from({ length: Math.max(1, levelsCount) }, (_, index) => ({
        value: `level-${index + 1}`,
        label: t('delivery.levelOption', { level: String(index + 1) })
      })),
    [levelsCount, t]
  );

  useEffect(() => {
    if (!deliveryOptions.find((option) => option.value === deliveryLevel)) {
      setDeliveryLevel(deliveryOptions[0]?.value ?? 'level-1');
    }
  }, [deliveryLevel, deliveryOptions]);

  return (
    <Form action={action} onSubmit={handleSubmit}>
      {badgeId ? <input type="hidden" name="id" value={badgeId} /> : null}
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
      </FormSection>

      <Divider />

      <FormSection>
        <div className={styles.imageRow}>
          <ImageUploadField
            previewUrl={imagePreviewUrl ?? undefined}
            label={t('fields.image')}
            placeholder={t('image.placeholder')}
            uploadLabel={t('image.upload')}
            maxSizeHint={t('image.maxSizeHint')}
            tooLargeLabel={t('image.tooLarge', { max: '5MB' })}
            clearLabel={t('image.clear')}
            maxSizeMb={5}
            resetKey={state.success ? 'reset' : undefined}
            required={!isEdit}
            error={Boolean(fieldError('imageFile'))}
            helperText={fieldError('imageFile')}
          />
        </div>
      </FormSection>

      <Divider />

      <OpenBadgeLevelsEditor
        initialLevels={initialLevels}
        onLevelsChange={(levels) => setLevelsCount(levels.length)}
        maxLevels={5}
        error={fieldError('levels' as keyof OpenBadgeCreateRequest)}
        labels={{
          add: t('levels.add'),
          title: t('fields.levelTitle'),
          description: t('fields.levelDescription'),
          remove: t('levels.remove'),
          chipPrefix: t('levels.chipPrefix'),
          minLevels: t('levels.min')
        }}
      />

      <Divider />

      <FormSection>
        <SectionSubtitle>{t('delivery.title')}</SectionSubtitle>
        <Typography variant="body1" className={styles.sectionDescription}>
          {t('delivery.description')}
        </Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          <Switch
            name="deliveryEnabled"
            checked={deliveryEnabled}
            onChange={(event) => setDeliveryEnabled(event.target.checked)}
            slotProps={{
              input: {
                'aria-label': t('delivery.title')
              }
            }}
          />
          <FormControl size="small">
            <InputLabel id="open-badge-delivery-level-label">{t('delivery.levelLabel')}</InputLabel>
            <Select
              labelId="open-badge-delivery-level-label"
              name="deliveryLevel"
              label={t('delivery.levelLabel')}
              value={deliveryLevel}
              onChange={(event) => setDeliveryLevel(event.target.value as string)}
              disabled={!deliveryEnabled || isPending}
            >
              {deliveryOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </FormSection>

      <Divider />

      <FormSection>
        <SectionSubtitle>{t('activation.title')}</SectionSubtitle>
        <Typography variant="body1" className={styles.sectionDescription}>
          {t('activation.description')}
        </Typography>
        <FormControl>
          <Switch
            name="activationEnabled"
            defaultChecked={state.values.activationEnabled}
            slotProps={{
              input: {
                'aria-label': t('activation.title')
              }
            }}
          />
          <Typography variant="caption" className={styles.sectionNote}>
            {t('activation.note')}
          </Typography>
        </FormControl>
      </FormSection>

      <Divider />

      <FormActions>
        <AdminButton variant="outlined" component={Link} href="/hub/admin/open-badges">
          {t('actions.back')}
        </AdminButton>
        <AdminButton variant="contained" type="submit" disabled={isPending}>
          {t('actions.save')}
        </AdminButton>
      </FormActions>
    </Form>
  );
}
