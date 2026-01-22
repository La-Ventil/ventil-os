'use server';

import type { JSX } from 'react';
import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import Typography from '@mui/material/Typography';
import ProfileForm from '@repo/ui/forms/profile.form';
import Section from '@repo/ui/section';
import SectionSubtitle from '@repo/ui/section-subtitle';
import SectionTitle from '@repo/ui/section-title';
import { updateProfile } from '../../../../lib/actions/update-profile';
import { getUserProfileFromSession } from '../../../../lib/auth';

export default async function Page(): Promise<JSX.Element> {
  const userProfilePromise = getUserProfileFromSession();
  const t = await getTranslations('pages.hub.profileSettings');
  const tCommon = await getTranslations('common');

  return (
    <>
      <SectionTitle>{t('title')}</SectionTitle>
      <Section>
        <SectionSubtitle>{t('subtitle')}</SectionSubtitle>
        <Typography variant="body1">{t('intro')}</Typography>
      </Section>
      <Suspense fallback={<div>{tCommon('status.loading')}</div>}>
        <ProfileForm profilePromise={userProfilePromise} handleSubmit={updateProfile} />
      </Suspense>
    </>
  );
}
