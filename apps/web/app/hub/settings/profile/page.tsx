'use server';

import type { JSX } from 'react';
import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import Typography from '@mui/material/Typography';
import ChangeEmailForm from '@repo/ui/forms/change-email.form';
import ChangePasswordForm from '@repo/ui/forms/change-password.form';
import ProfileForm from '@repo/ui/forms/profile.form';
import Section from '@repo/ui/section';
import SectionSubtitle from '@repo/ui/section-subtitle';
import SectionTitle from '@repo/ui/section-title';
import { changePasswordAction } from '../../../../lib/actions/auth/change-password';
import { cancelEmailChangeAction } from '../../../../lib/actions/auth/cancel-email-change';
import { resendEmailChangeAction } from '../../../../lib/actions/auth/resend-email-change';
import { updateEmailAction } from '../../../../lib/actions/auth/update-email';
import { updateProfileAction } from '../../../../lib/actions/users/update-profile';
import { getUserProfileFromSession } from '../../../../lib/auth';

export default async function Page(): Promise<JSX.Element> {
  const userProfilePromise = getUserProfileFromSession();
  const userProfile = await userProfilePromise;
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
        <ProfileForm profilePromise={userProfilePromise} handleSubmit={updateProfileAction} />
      </Suspense>
      <Section>
        <SectionSubtitle>{t('emailSubtitle')}</SectionSubtitle>
        <Typography variant="body1">{t('emailIntro')}</Typography>
      </Section>
      <ChangeEmailForm
        handleSubmit={updateEmailAction}
        defaultEmail={userProfile.email}
        pendingEmail={userProfile.pendingEmail}
        resendEmailChange={resendEmailChangeAction}
        cancelEmailChange={cancelEmailChangeAction}
      />
      <Section>
        <SectionSubtitle>{t('passwordSubtitle')}</SectionSubtitle>
        <Typography variant="body1">{t('passwordIntro')}</Typography>
      </Section>
      <ChangePasswordForm handleSubmit={changePasswordAction} />
    </>
  );
}
