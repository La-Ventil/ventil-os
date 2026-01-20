import { getTranslations } from 'next-intl/server';
import Typography from '@mui/material/Typography';
import Section from '@repo/ui/section';
import SectionTitle from '@repo/ui/section-title';

export default async function Page() {
  const t = await getTranslations('pages.hub.home');

  return (
    <>
      <SectionTitle>{t('title')}</SectionTitle>
      <Section>
        <Typography variant="body1">{t('intro')}</Typography>
      </Section>
    </>
  );
}
