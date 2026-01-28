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
import { getTranslations } from 'next-intl/server';
import SectionSubtitle from '../section-subtitle';
import AdminButton from '../admin/admin-button';
import ImageUploadField from '../admin/image-upload-field';
import FormActions from '../form-actions';
import FormSection from '../form-section';
import styles from './machine-create.form.module.css';

export default async function MachineCreateForm() {
  const t = await getTranslations('pages.hub.admin.machinesCreate');

  const labels = {
    fields: {
      name: t('fields.name'),
      description: t('fields.description'),
      image: t('fields.image')
    },
    image: {
      placeholder: t('image.placeholder'),
      upload: t('image.upload')
    },
    badgeRequirement: {
      title: t('badgeRequirement.title'),
      description: t('badgeRequirement.description'),
      searchLabel: t('badgeRequirement.searchLabel'),
      searchPlaceholder: t('badgeRequirement.searchPlaceholder'),
      badgeType: t('badgeRequirement.badgeType'),
      badgeName: t('badgeRequirement.badgeName'),
      removeLabel: t('badgeRequirement.removeLabel')
    },
    activation: {
      title: t('activation.title'),
      description: t('activation.description')
    },
    actions: {
      back: t('actions.back'),
      save: t('actions.save')
    }
  };

  return (
    <Stack component="form" spacing={2}>
      <FormSection>
        <TextField label={labels.fields.name} required fullWidth />
        <TextField label={labels.fields.description} required fullWidth />

        <div className={styles.imageRow}>
          <ImageUploadField
            label={labels.fields.image}
            placeholder={labels.image.placeholder}
            uploadLabel={labels.image.upload}
            required
          />
        </div>
      </FormSection>

      <Divider />

      <FormSection>
        <SectionSubtitle>{labels.badgeRequirement.title}</SectionSubtitle>
        <Typography variant="body1" className={styles.sectionDescription}>
          {labels.badgeRequirement.description}
        </Typography>
        <Switch defaultChecked />
        <Stack spacing={2}>
          <TextField
            label={labels.badgeRequirement.searchLabel}
            placeholder={labels.badgeRequirement.searchPlaceholder}
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
            <div className={styles.badgeIllustration}>{labels.image.placeholder}</div>
            <Stack spacing={0.5}>
              <Typography className={styles.badgeType}>
                {labels.badgeRequirement.badgeType}
              </Typography>
              <Typography className={styles.badgeName}>{labels.badgeRequirement.badgeName}</Typography>
            </Stack>
            <IconButton aria-label={labels.badgeRequirement.removeLabel}>
              <CloseIcon />
            </IconButton>
          </div>
        </Stack>
      </FormSection>

      <Divider />

      <FormSection>
        <SectionSubtitle>{labels.activation.title}</SectionSubtitle>
        <Typography variant="body1" className={styles.sectionDescription}>
          {labels.activation.description}
        </Typography>
        <Switch defaultChecked />
      </FormSection>

      <FormActions>
        <AdminButton variant="outlined" component={Link} href="/hub/admin/machines">
          {labels.actions.back}
        </AdminButton>
        <AdminButton variant="contained">{labels.actions.save}</AdminButton>
      </FormActions>
    </Stack>
  );
}
