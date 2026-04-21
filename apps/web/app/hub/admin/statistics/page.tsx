import { unstable_cache } from 'next/cache';
import { getLocale, getTimeZone, getTranslations } from 'next-intl/server';
import { viewAdminStatistics } from '@repo/application/users/usecases';

// Statistics are expensive to compute and change infrequently — cache for 10 minutes.
// Tag allows on-demand revalidation when users/registrations/awards are mutated.
const getCachedAdminStatistics = unstable_cache(viewAdminStatistics, ['admin-statistics'], {
  revalidate: 600,
  tags: ['admin-statistics']
});
import { adminStatIcon as AdminStatIcon } from '@repo/ui/icons/admin-stat-icon';
import GridBackground from '@repo/ui/grid-background.server';
import AdminStatisticsOverview from '@repo/ui/admin/admin-statistics-overview';
import UserNetworkGraph from '@repo/ui/admin/user-network-graph';
import SectionTitle from '@repo/ui/section-title.server';
import TableSection from '@repo/ui/table-section';
import { buildAdminStatisticsPageViewModel } from './_lib/build-admin-statistics-page-view-model';

export default async function AdminStatisticsPage() {
  const locale = await getLocale();
  const timeZone = await getTimeZone();
  const t = await getTranslations('pages.hub.admin.statistics');
  const tProfile = await getTranslations('profileSelector.option');
  const statistics = await getCachedAdminStatistics();

  const pageViewModel = buildAdminStatisticsPageViewModel({
    statistics,
    locale,
    timeZone,
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
        <UserNetworkGraph {...pageViewModel.userNetworkGraph} />
      </TableSection>
    </GridBackground>
  );
}
