import { getTranslations } from 'next-intl/server';
import Typography from '@mui/material/Typography';
import { EventIcon } from '@repo/ui/icons/event-icon';
import { MachineIcon } from '@repo/ui/icons/machine-icon';
import { OpenBadgeIcon } from '@repo/ui/icons/open-badge-icon';
import ProfileCard from '@repo/ui/profile-card';
import Section from '@repo/ui/section';
import SectionTitle from '@repo/ui/section-title';
import SectionSubtitle from '@repo/ui/section-subtitle';
import StatsList, { StatsListEntry } from '@repo/ui/stats-list';
import { getProfilUtilisateurFromSession } from '../../../lib/auth';

export default async function Page() {
  const profilUtilisateur = await getProfilUtilisateurFromSession();
  const t = await getTranslations('pages.hub.profile');
  const stats: StatsListEntry[] = [
    { id: 'events', icon: <EventIcon />, label: t('stats.events'), count: 0 },
    { id: 'open-badge', icon: <OpenBadgeIcon />, label: t('stats.openBadge'), count: 0 },
    { id: 'machine', icon: <MachineIcon />, label: t('stats.machine'), count: 0 }
  ];

  return (
    <>
      <Section>
        <SectionTitle>{profilUtilisateur.pseudo}</SectionTitle>
        <SectionSubtitle>{t('subtitle')}</SectionSubtitle>
        <Typography variant="body1">{t('intro')}</Typography>
      </Section>
      <ProfileCard profilUtilisateur={profilUtilisateur} />
      <Section>
        <StatsList stats={stats} />
      </Section>
    </>
  );
}
