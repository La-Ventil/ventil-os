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
import { getTranslations } from 'next-intl/server';
import SectionSubtitle from '../section-subtitle';
import AdminButton from '../admin/admin-button';
import ImageUploadField from '../admin/image-upload-field';
import LevelChip from '../level-chip';
import FormActions from '../form-actions';
import FormSection from '../form-section';
import styles from './open-badge-create.form.module.css';

export default async function OpenBadgeCreateForm() {
  const t = await getTranslations('pages.hub.admin.openBadgesCreate');

  return (
    <Stack component="form" spacing={2}>
      <FormSection>
        <TextField label={t('fields.name')} required fullWidth />
        <TextField label={t('fields.description')} required fullWidth />
      </FormSection>

      <Divider />

      <FormSection>
        <div className={styles.imageRow}>
          <ImageUploadField
            label={t('fields.image')}
            placeholder={t('image.placeholder')}
            uploadLabel={t('image.upload')}
            required
          />
        </div>
      </FormSection>

      <Divider />

      <FormSection direction="row" spacing={2} alignItems="flex-start">
        <LevelChip level={1} isActive size="medium" />
        <Stack spacing={2}>
          <TextField label={t('fields.levelTitle')} required fullWidth />
          <TextField
            label={t('fields.levelDescription')}
            required
            fullWidth
            multiline
            minRows={4}
          />
        </Stack>
      </FormSection>

      <Divider />

      <FormSection>
        <AdminButton variant="contained" color="secondary">
          {t('levels.add')}
        </AdminButton>
      </FormSection>

      <Divider />

      <FormSection>
        <SectionSubtitle>{t('delivery.title')}</SectionSubtitle>
        <Typography variant="body1" className={styles.sectionDescription}>
          {t('delivery.description')}
        </Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          <Switch defaultChecked />
          <FormControl size="small">
            <InputLabel id="open-badge-delivery-level-label">
              {t('delivery.levelLabel')}
            </InputLabel>
            <Select
              labelId="open-badge-delivery-level-label"
              label={t('delivery.levelLabel')}
              defaultValue="level-1"
            >
              <MenuItem value="level-1">{t('delivery.levelOption')}</MenuItem>
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
        <Switch defaultChecked />
      </FormSection>

      <Divider />

      <FormActions>
        <AdminButton variant="outlined" component={Link} href="/hub/admin/open-badges">
          {t('actions.back')}
        </AdminButton>
        <AdminButton variant="contained">{t('actions.save')}</AdminButton>
      </FormActions>
    </Stack>
  );
}
