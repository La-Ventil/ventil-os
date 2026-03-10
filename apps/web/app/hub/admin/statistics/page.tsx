import { getLocale, getTranslations } from 'next-intl/server';
import { viewAdminStatistics } from '@repo/application/users/usecases';
import type { UserRole } from '@repo/domain/user/user-role';
import { adminStatIcon as AdminStatIcon } from '@repo/ui/icons/admin-stat-icon';
import { EventIcon } from '@repo/ui/icons/event-icon';
import GridBackground from '@repo/ui/grid-background';
import { MachineIcon } from '@repo/ui/icons/machine-icon';
import { OpenBadgeIcon } from '@repo/ui/icons/open-badge-icon';
import { ProfileIcon } from '@repo/ui/icons/profile-icon';
import AdminStatisticsOverview from '@repo/ui/admin/admin-statistics-overview';
import AdminUserExchangeGraph from '@repo/ui/admin/admin-user-exchange-graph';
import SectionTitle from '@repo/ui/section-title';
import TableSection from '@repo/ui/table-section';

export default async function AdminStatisticsPage() {
  const locale = await getLocale();
  const t = await getTranslations('pages.hub.admin.statistics');
  const tProfile = await getTranslations('profileSelector.option');
  const statistics = await viewAdminStatistics();

  const overviewGroups = [
    {
      id: 'users',
      title: t('overview.users'),
      icon: <ProfileIcon fontSize="small" />,
      metrics: [
        { label: t('overview.members'), value: statistics.overview.usersByRole.member, tone: 'blue' as const },
        { label: t('overview.alumni'), value: statistics.overview.usersByRole.alumni, tone: 'blue' as const },
        { label: t('overview.teachers'), value: statistics.overview.usersByRole.teacher, tone: 'blue' as const },
        {
          label: t('overview.contributors'),
          value: statistics.overview.usersByRole.contributor,
          tone: 'yellow' as const
        },
        { label: t('overview.visitors'), value: statistics.overview.usersByRole.visitor, tone: 'red' as const }
      ]
    },
    {
      id: 'events',
      title: t('overview.events'),
      icon: <EventIcon fontSize="small" />,
      metrics: [
        { label: t('overview.organizedEvents'), value: statistics.overview.eventsOrganizedCount },
        { label: t('overview.eventParticipants'), value: statistics.overview.eventParticipantsCount }
      ]
    },
    {
      id: 'open-badges',
      title: t('overview.openBadges'),
      icon: <OpenBadgeIcon fontSize="small" />,
      metrics: [
        { label: t('overview.createdOpenBadges'), value: statistics.overview.openBadgesCreatedCount },
        { label: t('overview.deliveredOpenBadges'), value: statistics.overview.openBadgesDeliveredCount }
      ]
    },
    {
      id: 'machines',
      title: t('overview.machines'),
      icon: <MachineIcon fontSize="small" />,
      metrics: [
        { label: t('overview.createdMachines'), value: statistics.overview.machinesCreatedCount },
        { label: t('overview.machineUsages'), value: statistics.overview.machineUsagesCount }
      ]
    }
  ];

  const generatedAtDate = new Date(statistics.network.generatedAt);
  const generatedAt = new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(generatedAtDate);

  const roleByKey: Record<UserRole, string> = {
    member: tProfile('member.label'),
    alumni: tProfile('alumni.label'),
    teacher: tProfile('teacher.label'),
    contributor: tProfile('contributor.label'),
    visitor: tProfile('visitor.label')
  };

  return (
    <GridBackground component="section" spacing={2}>
      <SectionTitle icon={<AdminStatIcon color="secondary" />}>{t('title')}</SectionTitle>

      <TableSection>
        <AdminStatisticsOverview groups={overviewGroups} />
      </TableSection>

      <TableSection>
        <AdminUserExchangeGraph
          nodes={statistics.network.nodes}
          edges={statistics.network.edges}
          labels={{
            productionTitle: t('graph.productionTitle'),
            productionDescription: t('graph.productionDescription'),
            exchangeTitle: t('graph.exchangeTitle'),
            exchangeDescription: t('graph.exchangeDescription'),
            generatedAt: t('graph.generatedAt', { value: generatedAt }),
            empty: t('graph.empty'),
            roleByKey
          }}
        />
      </TableSection>
    </GridBackground>
  );
}
