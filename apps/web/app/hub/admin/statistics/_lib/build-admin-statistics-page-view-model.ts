import type { UserRole } from '@repo/domain/user/user-role';
import type { AdminStatisticsOverviewGroup } from '@repo/ui/admin/admin-statistics-overview';
import type { UserNetworkGraphLabels } from '@repo/ui/admin/user-network-graph';
import type { AdminStatisticsOverviewViewModel } from '@repo/application/admin/models/admin-statistics';
import { buildAdminStatisticsOverviewGroups, buildRoleLabels } from './admin-statistics-overview-groups';

type TranslateValues = Record<string, string | number | Date>;
type Translate = (key: string, values?: TranslateValues) => string;

export type AdminStatisticsPageViewModel = {
  overviewGroups: AdminStatisticsOverviewGroup[];
  // generatedAt is excluded — it depends on network data fetched lazily by the client.
  networkGraphLabels: Omit<UserNetworkGraphLabels, 'generatedAt'>;
};

type BuildAdminStatisticsPageViewModelInput = {
  overview: AdminStatisticsOverviewViewModel;
  tStatistics: Translate;
  tProfile: Translate;
};

export function buildAdminStatisticsPageViewModel({
  overview,
  tStatistics,
  tProfile
}: BuildAdminStatisticsPageViewModelInput): AdminStatisticsPageViewModel {
  const overviewGroups = buildAdminStatisticsOverviewGroups({
    statistics: overview,
    t: (key) => tStatistics(key)
  });
  const roleByKey = buildRoleLabels((key) => tProfile(key));
  const networkGraphLabels: Omit<UserNetworkGraphLabels, 'generatedAt'> = {
    label: tStatistics('graph.label'),
    interactionHint: tStatistics('graph.interactionHint'),
    productionTitle: tStatistics('graph.productionTitle'),
    productionDescription: tStatistics('graph.productionDescription'),
    exchangeTitle: tStatistics('graph.exchangeTitle'),
    exchangeDescription: tStatistics('graph.exchangeDescription'),
    empty: tStatistics('graph.empty'),
    roleByKey: roleByKey as Record<UserRole, string>
  };

  return { overviewGroups, networkGraphLabels };
}
