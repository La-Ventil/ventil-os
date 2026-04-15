import type { UserRole } from '@repo/domain/user/user-role';
import type { AdminStatisticsOverviewGroup } from '@repo/ui/admin/admin-statistics-overview';
import type { UserNetworkGraphProps } from '@repo/ui/admin/user-network-graph';
import type { AdminStatisticsViewModel } from '@repo/application/admin/models/admin-statistics';
import { formatShortDateTime } from '../../../../../lib/format-date';
import { buildAdminStatisticsOverviewGroups, buildRoleLabels } from './admin-statistics-overview-groups';

type TranslateValues = Record<string, string | number | Date>;
type Translate = (key: string, values?: TranslateValues) => string;

export type AdminStatisticsPageViewModel = {
  overviewGroups: AdminStatisticsOverviewGroup[];
  userNetworkGraph: UserNetworkGraphProps;
};

type BuildAdminStatisticsPageViewModelInput = {
  statistics: AdminStatisticsViewModel;
  locale: string;
  timeZone: string;
  tStatistics: Translate;
  tProfile: Translate;
};

export function buildAdminStatisticsPageViewModel({
  statistics,
  locale,
  timeZone,
  tStatistics,
  tProfile
}: BuildAdminStatisticsPageViewModelInput): AdminStatisticsPageViewModel {
  const overviewGroups = buildAdminStatisticsOverviewGroups({
    statistics: statistics.overview,
    t: (key) => tStatistics(key)
  });
  const roleByKey = buildRoleLabels((key) => tProfile(key));
  const labels: UserNetworkGraphProps['labels'] = {
    label: tStatistics('graph.label'),
    interactionHint: tStatistics('graph.interactionHint'),
    productionTitle: tStatistics('graph.productionTitle'),
    productionDescription: tStatistics('graph.productionDescription'),
    exchangeTitle: tStatistics('graph.exchangeTitle'),
    exchangeDescription: tStatistics('graph.exchangeDescription'),
    generatedAt: tStatistics('graph.generatedAt', {
      value: formatShortDateTime(statistics.network.generatedAt, locale, timeZone)
    }),
    empty: tStatistics('graph.empty'),
    roleByKey: roleByKey as Record<UserRole, string>
  };

  return {
    overviewGroups,
    userNetworkGraph: {
      nodes: statistics.network.nodes,
      edges: statistics.network.edges,
      labels
    }
  };
}
