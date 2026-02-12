import type { JSX } from 'react';
import { getTranslations } from 'next-intl/server';
import Typography from '@mui/material/Typography';
import { EventIcon } from '@repo/ui/icons/event-icon';
import { MachineIcon } from '@repo/ui/icons/machine-icon';
import { OpenBadgeIcon } from '@repo/ui/icons/open-badge-icon';
import { ProfileIcon } from '@repo/ui/icons/profile-icon';
import ProfileCard from '@repo/ui/profile-card';
import Section from '@repo/ui/section';
import SectionTitle from '@repo/ui/section-title';
import SectionSubtitle from '@repo/ui/section-subtitle';
import StatsList, { StatsListEntry } from '@repo/ui/stats-list';
import { getUserProfileStats } from '@repo/application';
import { getUserProfileFromSession } from '../../../lib/auth';

export default async function Page(): Promise<JSX.Element> {
  const userProfile = await getUserProfileFromSession();
  const statsCounts = await getUserProfileStats(userProfile.id);
  const t = await getTranslations('pages.hub.profile');
  const stats: StatsListEntry[] = [
    { id: 'events', icon: <EventIcon />, label: t('stats.events'), count: statsCounts.events },
    { id: 'open-badge', icon: <OpenBadgeIcon />, label: t('stats.openBadge'), count: statsCounts.openBadges },
    { id: 'machine', icon: <MachineIcon />, label: t('stats.machine'), count: statsCounts.machines }
  ];

  return (
    <>
      <SectionTitle icon={<ProfileIcon color="secondary" />}>{userProfile.username}</SectionTitle>
      <Section>
        <SectionSubtitle>{t('subtitle')}</SectionSubtitle>
        <Typography variant="body1">{t('intro')}</Typography>
      </Section>
      <ProfileCard profile={userProfile} />
      <Section>
        <StatsList stats={stats} />
      </Section>
    </>
  );
}
