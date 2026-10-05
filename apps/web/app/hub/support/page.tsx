import type { ReactElement } from 'react';
import Typography from '@mui/material/Typography';
import { getTranslations } from 'next-intl/server';
import { DebugIcon } from '@repo/ui/icons/debug-icon';
import Section from '@repo/ui/section';
import SectionSubtitle from '@repo/ui/section-subtitle.server';
import SectionTitle from '@repo/ui/section-title.server';
import { redirect } from 'next/navigation';
import { getServerSession } from '../../../lib/auth';
import styles from './page.module.css';

export default async function Page(): Promise<ReactElement> {
  const session = await getServerSession();
  if (!session) {
    redirect('/login');
  }

  const t = await getTranslations('pages.hub.support');

  return (
    <>
      <SectionTitle icon={<DebugIcon color="secondary" />}>{t('title')}</SectionTitle>
      <Section className={styles.block}>
        <SectionSubtitle className={styles.title}>{t('subtitle')}</SectionSubtitle>
        <Typography variant="body1">{t('intro')}</Typography>
        <Typography variant="body1">{t('contact')}</Typography>
        <a className={styles.link} href={`mailto:${t('contactEmail')}?subject=VentilOS`}>
          {t('contactEmail')}
        </a>
        <Typography variant="body1">{t('guidelines.title')}</Typography>
        <Typography variant="body1" component="ul" className={styles.guidelineList}>
          <li>{t('guidelines.items.subject')}</li>
          <li>{t('guidelines.items.details')}</li>
          <li>{t('guidelines.items.device')}</li>
          <li>{t('guidelines.items.feature')}</li>
        </Typography>
      </Section>
      <Section className={styles.block}>
        <SectionSubtitle className={styles.title}>{t('repository.title')}</SectionSubtitle>
        <Typography variant="body1">{t('repository.text')}</Typography>
        <a className={styles.link} href="https://github.com/La-Ventil/ventil-os" target="_blank" rel="noreferrer">
          https://github.com/La-Ventil/ventil-os
        </a>
        <Typography variant="body1">{t('repository.credits')}</Typography>
      </Section>
      <Section className={styles.block}>
        <SectionSubtitle className={styles.title}>{t('session.title')}</SectionSubtitle>
        <pre className={styles.sessionBlock}>{JSON.stringify(session, null, 2)}</pre>
      </Section>
    </>
  );
}
