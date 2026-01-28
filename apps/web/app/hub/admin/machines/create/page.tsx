import { getTranslations } from 'next-intl/server';
import Divider from '@mui/material/Divider';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Link from 'next/link';
import Section from '@repo/ui/section';
import SectionSubtitle from '@repo/ui/section-subtitle';
import SectionTitle from '@repo/ui/section-title';
import AdminButton from '@repo/ui/admin/admin-button';
import styles from './page.module.css';

export default async function AdminMachineCreatePage() {
  const t = await getTranslations('pages.hub.admin.machinesCreate');

  const labels = {
    title: t('title'),
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

        <SectionSubtitle>{labels.badgeRequirement.title}</SectionSubtitle>
        <Typography variant="body1" className={styles.sectionDescription}>
          {labels.badgeRequirement.description}
        </Typography>
        <div className={styles.toggleRow}>
          <Switch defaultChecked />
        </div>
        <div className={styles.badgeSearch}>
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
            <div className={styles.badgeInfo}>
              <Typography className={styles.badgeType}>{labels.badgeRequirement.badgeType}</Typography>
              <Typography className={styles.badgeName}>{labels.badgeRequirement.badgeName}</Typography>
            </div>
            <IconButton aria-label={labels.badgeRequirement.removeLabel}>
              <CloseIcon />
            </IconButton>
          </div>
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
          <AdminButton variant="outlined" component={Link} href="/hub/admin/machines">
            {labels.actions.back}
          </AdminButton>
          <AdminButton variant="contained">{labels.actions.save}</AdminButton>
        </div>
      </Section>
    </>
  );
}
