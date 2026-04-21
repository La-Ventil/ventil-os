import { isAdmin } from '@repo/domain/authorization';
import { getLocale, getTimeZone, getTranslations } from 'next-intl/server';
import { getServerSession } from '../../../../../lib/auth';
import { getCachedAdminStatistics } from '../../../../../lib/admin/get-cached-admin-statistics';
import { formatShortDateTime } from '../../../../../lib/format-date';

export async function GET() {
  const [session, tCommon, tStatistics, locale, timeZone] = await Promise.all([
    getServerSession(),
    getTranslations('common'),
    getTranslations('pages.hub.admin.statistics'),
    getLocale(),
    getTimeZone()
  ]);

  if (!session?.user || !isAdmin(session.user)) {
    return Response.json({ message: tCommon('errors.unauthorized') }, { status: 401 });
  }

  const statistics = await getCachedAdminStatistics();

  return Response.json({
    nodes: statistics.network.nodes,
    edges: statistics.network.edges,
    generatedAt: tStatistics('graph.generatedAt', {
      value: formatShortDateTime(statistics.network.generatedAt, locale, timeZone)
    })
  });
}
