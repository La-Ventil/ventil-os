import { getTranslations } from 'next-intl/server';
import Typography from '@mui/material/Typography';
import Section from '@repo/ui/section';
import SectionSubtitle from '@repo/ui/section-subtitle';
import SectionTitle from '@repo/ui/section-title';
import { canManageUsersUser } from '@repo/application';
import { redirect } from 'next/navigation';
import { getServerSession } from '../../../../lib/auth';

export default async function AdminUsersPage() {
  const session = await getServerSession();
  if (!session || !canManageUsersUser(session.user)) {
    redirect('/hub/profile');
  }
  const t = await getTranslations('pages.hub.admin.users');

  return (
    <>
      <SectionTitle>{t('title')}</SectionTitle>
      <Section>
        <SectionSubtitle>{t('subtitle')}</SectionSubtitle>
        <Typography variant="body1">{t('intro')}</Typography>
      </Section>
    </>
  );
}
