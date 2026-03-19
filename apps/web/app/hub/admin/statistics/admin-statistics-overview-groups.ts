import type { AdminStatisticsViewModel } from '@repo/application/admin/models/admin-statistics';
import type { AdminStatisticsOverviewGroup } from '@repo/ui/admin/admin-statistics-overview';
import { userRoleToneByRole } from '@repo/ui/admin/user-role-visual';
import { ThemeSection } from '@repo/ui/theme';

export type Translate = (key: string) => string;

export function buildAdminStatisticsOverviewGroups({
  statistics,
  t
}: {
  statistics: AdminStatisticsViewModel['overview'];
  t: Translate;
}): AdminStatisticsOverviewGroup[] {
  return [
    {
      id: ThemeSection.User,
      title: t('overview.users'),
      metrics: [
        { label: t('overview.members'), value: statistics.usersByRole.member, tone: userRoleToneByRole.member },
        { label: t('overview.alumni'), value: statistics.usersByRole.alumni, tone: userRoleToneByRole.alumni },
        { label: t('overview.teachers'), value: statistics.usersByRole.teacher, tone: userRoleToneByRole.teacher },
        {
          label: t('overview.contributors'),
          value: statistics.usersByRole.contributor,
          tone: userRoleToneByRole.contributor
        },
        { label: t('overview.visitors'), value: statistics.usersByRole.visitor, tone: userRoleToneByRole.visitor }
      ]
    },
    {
      id: ThemeSection.Event,
      title: t('overview.events'),
      metrics: [
        { label: t('overview.organizedEvents'), value: statistics.eventsOrganizedCount },
        { label: t('overview.eventParticipants'), value: statistics.eventParticipantsCount }
      ]
    },
    {
      id: ThemeSection.OpenBadge,
      title: t('overview.openBadges'),
      metrics: [
        { label: t('overview.createdOpenBadges'), value: statistics.openBadgesCreatedCount },
        { label: t('overview.deliveredOpenBadges'), value: statistics.openBadgesDeliveredCount }
      ]
    },
    {
      id: ThemeSection.FabLab,
      title: t('overview.machines'),
      metrics: [
        { label: t('overview.createdMachines'), value: statistics.machinesCreatedCount },
        { label: t('overview.machineUsages'), value: statistics.machineUsagesCount }
      ]
    }
  ];
}

export function buildRoleLabels(tProfile: Translate) {
  return {
    member: tProfile('member.label'),
    alumni: tProfile('alumni.label'),
    teacher: tProfile('teacher.label'),
    contributor: tProfile('contributor.label'),
    visitor: tProfile('visitor.label')
  } as const;
}
