import { formatUserFullName } from '@repo/domain/user/user-name';
import type { AdminStatisticsReadModel } from '@repo/db/read-models';
import type { AdminStatisticsViewModel } from '@repo/view-models/admin-statistics';

export const mapAdminStatisticsToViewModel = (statistics: AdminStatisticsReadModel): AdminStatisticsViewModel => ({
  overview: statistics.overview,
  network: {
    generatedAt: statistics.network.generatedAt.toISOString(),
    edges: statistics.network.edges,
    nodes: statistics.network.nodes.map((node) => ({
      userId: node.userId,
      fullName: formatUserFullName(node),
      avatarUrl: node.avatarUrl,
      role: node.role,
      blocked: node.blocked,
      productionIndex: node.productionIndex,
      machinesUsedCount: node.machinesUsedCount,
      repairedObjectsCount: node.repairedObjectsCount,
      exchangeCount: node.exchangeCount,
      inactive: node.inactive
    }))
  }
});
