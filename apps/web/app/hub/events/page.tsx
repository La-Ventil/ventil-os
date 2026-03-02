import Typography from '@mui/material/Typography';
import { getTranslations } from 'next-intl/server';
import ListEmptyState from '@repo/ui/list-empty-state';
import Section from '@repo/ui/section';
import SectionSubtitle from '@repo/ui/section-subtitle';
import SectionTitle from '@repo/ui/section-title';
import { EventIcon } from '@repo/ui/icons/event-icon';

export default async function EventsPage() {
  const t = await getTranslations('pages.hub.events');

  return (
    <>
      <SectionTitle icon={<EventIcon color="secondary" />}>{t('title')}</SectionTitle>
      <Section>
        <SectionSubtitle>{t('subtitle')}</SectionSubtitle>
        <Typography variant="body1">{t('intro')}</Typography>
      </Section>
      <Section>
        <ListEmptyState title={t('placeholder.title')} description={t('placeholder.description')} />
      </Section>
    </>
  );
}
