import { getTranslations } from 'next-intl/server';
import Divider from '@mui/material/Divider';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Link from 'next/link';
import Section from '@repo/ui/section';
import SectionSubtitle from '@repo/ui/section-subtitle';
import SectionTitle from '@repo/ui/section-title';
import AdminButton from '@repo/ui/admin/admin-button';
import styles from './page.module.css';

export default async function AdminOpenBadgeCreatePage() {
  const t = await getTranslations('pages.hub.admin.openBadgesCreate');

  const labels = {
    title: t('title'),
    fields: {
      name: t('fields.name'),
      description: t('fields.description'),
      image: t('fields.image'),
      levelTitle: t('fields.levelTitle'),
      levelDescription: t('fields.levelDescription')
    },
    image: {
      placeholder: t('image.placeholder'),
      upload: t('image.upload')
    },
    levels: {
      add: t('levels.add')
    },
    delivery: {
      title: t('delivery.title'),
      description: t('delivery.description'),
      levelLabel: t('delivery.levelLabel'),
      levelOption: t('delivery.levelOption')
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
    <>
      <SectionTitle>{labels.title}</SectionTitle>
      <Section className={styles.form}>
        <TextField label={labels.fields.name} required fullWidth />
        <TextField label={labels.fields.description} required fullWidth />

        <div className={styles.imageRow}>
          <div className={styles.imagePlaceholder}>{labels.image.placeholder}</div>
          <div className={styles.imageControls}>
            <TextField label={labels.fields.image} required fullWidth />
            <AdminButton variant="contained">{labels.image.upload}</AdminButton>
          </div>
        </div>

        <Divider />

        <div className={styles.levelRow}>
          <div className={styles.levelMarker}>1</div>
          <div className={styles.levelFields}>
            <TextField label={labels.fields.levelTitle} required fullWidth />
            <TextField
              label={labels.fields.levelDescription}
              required
              fullWidth
              multiline
              minRows={4}
            />
          </div>
        </div>

        <AdminButton variant="contained" color="secondary">
          {labels.levels.add}
        </AdminButton>

        <Divider />

        <SectionSubtitle>{labels.delivery.title}</SectionSubtitle>
        <Typography variant="body1" className={styles.sectionDescription}>
          {labels.delivery.description}
        </Typography>
        <div className={styles.deliveryRow}>
          <Switch defaultChecked />
          <FormControl size="small">
            <InputLabel id="open-badge-delivery-level-label">{labels.delivery.levelLabel}</InputLabel>
            <Select
              labelId="open-badge-delivery-level-label"
              label={labels.delivery.levelLabel}
              defaultValue="level-1"
            >
              <MenuItem value="level-1">{labels.delivery.levelOption}</MenuItem>
            </Select>
          </FormControl>
        </div>

        <Divider />

        <SectionSubtitle>{labels.activation.title}</SectionSubtitle>
        <Typography variant="body1" className={styles.sectionDescription}>
          {labels.activation.description}
        </Typography>
        <div className={styles.toggleRow}>
          <Switch defaultChecked />
        </div>

        <div className={styles.actions}>
          <AdminButton variant="outlined" component={Link} href="/hub/admin/open-badges">
            {labels.actions.back}
          </AdminButton>
          <AdminButton variant="contained">{labels.actions.save}</AdminButton>
        </div>
      </Section>
    </>
  );
}
