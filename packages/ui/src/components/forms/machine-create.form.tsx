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
import Alert from '@mui/material/Alert';
import { useTranslations } from 'next-intl';
import { MachineCreateFormInput } from '@repo/application/forms';
import SectionSubtitle from '../section-subtitle';
import AdminButton from '../admin/admin-button';
import ImageUploadField from '../admin/image-upload-field';
import FormActions from '../form-actions';
import FormSection from '../form-section';
import { FormActionStateTuple } from '../../form-action-state';
import { FormState } from '../../form-state';
import { firstFieldError } from './form-errors';
import styles from './machine-create.form.module.css';

export interface MachineCreateFormProps {
  actionState: FormActionStateTuple<FormState<MachineCreateFormInput>>;
}

export default function MachineCreateForm({ actionState: [state, action, isPending] }: MachineCreateFormProps) {
  const t = useTranslations('pages.hub.admin.machinesCreate');
  const fieldError = (field: keyof MachineCreateFormInput) => firstFieldError(state, field);

  return (
    <Stack component="form" action={action} spacing={2}>
      {state.message && !isPending && <Alert severity={state.success ? 'success' : 'error'}>{state.message}</Alert>}
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
            name="imageUrl"
            defaultValue={state.values.imageUrl}
            label={t('fields.image')}
            placeholder={t('image.placeholder')}
            uploadLabel={t('image.upload')}
            clearLabel={t('image.clear')}
            maxSizeMb={5}
            required
            error={Boolean(fieldError('imageUrl'))}
            helperText={fieldError('imageUrl')}
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
        <AdminButton variant="outlined" component={Link} href="/hub/admin/machines">
          {t('actions.back')}
        </AdminButton>
        <AdminButton variant="contained" type="submit" disabled={isPending}>
          {t('actions.save')}
        </AdminButton>
      </FormActions>
    </Stack>
  );
}
