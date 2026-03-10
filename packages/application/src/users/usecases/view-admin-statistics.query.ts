import { userRepository } from '@repo/db';
import type { AdminStatisticsViewModel } from '@repo/view-models/admin-statistics';
import { mapAdminStatisticsToViewModel } from '../../presenters/admin-statistics';
import type { Query } from '../../usecase';

export const viewAdminStatistics: Query<[], AdminStatisticsViewModel> = async () => {
  const statistics = await userRepository.getAdminStatistics(new Date());
  return mapAdminStatisticsToViewModel(statistics);
};
