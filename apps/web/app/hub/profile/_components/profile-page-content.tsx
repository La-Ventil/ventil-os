import type { JSX } from 'react';
import { getTranslations } from 'next-intl/server';
import Typography from '@mui/material/Typography';
import { EventIcon } from '@repo/ui/icons/event-icon';
import { MachineIcon } from '@repo/ui/icons/machine-icon';
import { OpenBadgeIcon } from '@repo/ui/icons/open-badge-icon';
import { ProfileIcon } from '@repo/ui/icons/profile-icon';
import ProfileCard from '@repo/ui/profile-card.server';
import Section from '@repo/ui/section';
import SectionTitle from '@repo/ui/section-title.server';
import SectionSubtitle from '@repo/ui/section-subtitle.server';
import StatsList, { StatsListEntry } from '@repo/ui/stats-list';
import type { UserProfile } from '@repo/application/users/models/user-profile';
import { viewUserStats } from '@repo/application/users/usecases';

type ProfilePageContentProps = {
  profile: UserProfile;
};

export default async function ProfilePageContent({ profile }: ProfilePageContentProps): Promise<JSX.Element> {
  const statsCounts = await viewUserStats(profile.id);
  const [t, tNavigation] = await Promise.all([
    getTranslations('pages.hub.profile'),
    getTranslations('pages.hub.navigation')
  ]);
  const stats: StatsListEntry[] = [
    { id: 'events', icon: <EventIcon />, label: t('stats.events'), count: statsCounts.eventsCount },
    { id: 'open-badge', icon: <OpenBadgeIcon />, label: t('stats.openBadge'), count: statsCounts.openBadgesCount },
    {
      id: 'open-badge-assigned',
      icon: <OpenBadgeIcon />,
      label: t('stats.openBadgeAssigned'),
      count: statsCounts.openBadgesAssignedCount
    },
    { id: 'machine', icon: <MachineIcon />, label: t('stats.machine'), count: statsCounts.machinesCount }
  ];

  return (
    <>
      <SectionTitle icon={<ProfileIcon color="secondary" />}>{profile.username}</SectionTitle>
      <Section>
        <SectionSubtitle>{t('subtitle')}</SectionSubtitle>
        <Typography variant="body1">{t('intro')}</Typography>
      </Section>
      <ProfileCard
        profile={profile}
        avatarHref="/hub/profile/avatar"
        avatarLinkLabel={t('actions.editAvatar')}
        avatarAlt={tNavigation('profileAvatarAlt', { email: profile.email })}
      />
      <Section>
        <StatsList stats={stats} />
      </Section>
    </>
  );
}
