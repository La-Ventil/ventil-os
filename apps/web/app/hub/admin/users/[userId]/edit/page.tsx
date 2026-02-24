import { getTranslations } from 'next-intl/server';
import { redirect, notFound } from 'next/navigation';
import Typography from '@mui/material/Typography';
import { canManageUsers } from '@repo/application';
import { viewUserProfileById } from '@repo/application/users/usecases';
import Section from '@repo/ui/section';
import SectionSubtitle from '@repo/ui/section-subtitle';
import SectionTitle from '@repo/ui/section-title';
import ProfileForm from '@repo/ui/forms/profile.form';
import { getServerSession } from '../../../../../../lib/auth';
import { updateUserProfileAction } from '../../../../../../lib/actions/update-user-profile';

type AdminUserEditPageProps = {
  params: Promise<{ userId: string }>;
};

export default async function AdminUserEditPage({ params }: AdminUserEditPageProps) {
  const session = await getServerSession();
  const userCanManageUsers = canManageUsers(session?.user);

  if (!session || !userCanManageUsers) {
    redirect('/hub/profile');
  }

  const { userId } = await params;
  if (!userId) {
    notFound();
  }

  const t = await getTranslations('pages.hub.admin.usersEdit');
  const profile = await viewUserProfileById(userId);
  if (!profile) {
    notFound();
  }

  return (
    <>
      <SectionTitle>{t('title')}</SectionTitle>
      <Section>
        <SectionSubtitle>{t('subtitle')}</SectionSubtitle>
        <Typography variant="body1">{t('intro')}</Typography>
      </Section>
      <Section>
        <ProfileForm
          profilePromise={Promise.resolve(profile)}
          handleSubmit={updateUserProfileAction}
          userId={userId}
          backHref="/hub/admin/users"
        />
      </Section>
    </>
  );
}
