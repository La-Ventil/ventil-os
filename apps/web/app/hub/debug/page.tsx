'use client';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTranslations } from 'next-intl';
import { DebugIcon } from '@repo/ui/icons/debug-icon';
import SectionSubtitle from '@repo/ui/section-subtitle';
import SectionTitle from '@repo/ui/section-title';
import styles from './page.module.css';

export default function Page() {
  const t = useTranslations('pages.hub.debug');

  return (
    <Stack spacing={2.5} className={styles.root}>
      <SectionTitle icon={<DebugIcon />}>{t('title')}</SectionTitle>
      <SectionSubtitle>{t('subtitle')}</SectionSubtitle>
      <Typography variant="body1">{t('intro')}</Typography>
      <Typography variant="body1">{t('contact')}</Typography>

      <div className={styles.illustration}>{t('illustrationPlaceholder')}</div>

      <div className={styles.guidelines}>
        <Typography variant="body2">{t('guidelines.title')}</Typography>
        <ul className={styles.guidelineList}>
          <li>{t('guidelines.items.subject')}</li>
          <li>{t('guidelines.items.details')}</li>
          <li>{t('guidelines.items.device')}</li>
        </ul>
      </div>
    </Stack>
  );
}
