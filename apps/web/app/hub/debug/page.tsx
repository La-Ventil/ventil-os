import type { ReactElement } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { getTranslations } from 'next-intl/server';
import { DebugIcon } from '@repo/ui/icons/debug-icon';
import SectionSubtitle from '@repo/ui/section-subtitle';
import SectionTitle from '@repo/ui/section-title';
import { redirect } from 'next/navigation';
import styles from './page.module.css';
import { getServerSession } from '../../../lib/auth';

export default async function Page(): Promise<ReactElement> {
  const session = await getServerSession();
  if (!session) {
    redirect('/signin');
  }

  const t = await getTranslations('pages.hub.debug');

  return (
    <Stack spacing={2.5} className={styles.root}>
      <SectionTitle icon={<DebugIcon />}>{t('title')}</SectionTitle>

      <SectionSubtitle>{t('subtitle')}</SectionSubtitle>
      <Typography variant="body1">{t('intro')}</Typography>
      <Typography variant="body1">{t('contact')}</Typography>
      <div className={styles.illustration}>{t('illustrationPlaceholder')}</div>
      <Typography variant="body1">{t('guidelines.title')}</Typography>
      <ul className={styles.guidelineList}>
        <li>{t('guidelines.items.subject')}</li>
        <li>{t('guidelines.items.details')}</li>
        <li>{t('guidelines.items.device')}</li>
      </ul>

      <SectionSubtitle>{t('session.title')}</SectionSubtitle>
      <pre className={styles.sessionBlock}>{JSON.stringify(session, null, 2)}</pre>
    </Stack>
  );
}
