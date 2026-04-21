import { getTranslations } from 'next-intl/server';
import { adminStatIcon as AdminStatIcon } from '@repo/ui/icons/admin-stat-icon';
import GridBackground from '@repo/ui/grid-background.server';
import AdminStatisticsOverview from '@repo/ui/admin/admin-statistics-overview';
import SectionTitle from '@repo/ui/section-title.server';
import TableSection from '@repo/ui/table-section';
import { getCachedAdminStatistics } from '../../../../lib/admin/get-cached-admin-statistics';
import { buildAdminStatisticsPageViewModel } from './_lib/build-admin-statistics-page-view-model';
import UserNetworkGraphLazy from './_components/user-network-graph-lazy.client';

export default async function AdminStatisticsPage() {
  const [t, tProfile, statistics] = await Promise.all([
    getTranslations('pages.hub.admin.statistics'),
    getTranslations('profileSelector.option'),
    getCachedAdminStatistics()
  ]);

  const pageViewModel = buildAdminStatisticsPageViewModel({
    overview: statistics.overview,
    tStatistics: t,
    tProfile
  });

  return (
    <GridBackground component="section" spacing={2}>
      <SectionTitle icon={<AdminStatIcon color="secondary" />}>{t('title')}</SectionTitle>

      <TableSection>
        <AdminStatisticsOverview groups={pageViewModel.overviewGroups} />
      </TableSection>

      <TableSection>
        <UserNetworkGraphLazy labelsWithoutDate={pageViewModel.networkGraphLabels} />
      </TableSection>
    </GridBackground>
  );
}
