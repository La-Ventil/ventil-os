import { unstable_cache } from 'next/cache';
import { viewAdminStatistics } from '@repo/application/users/usecases';

// Statistics are expensive to compute and change infrequently — cache for 10 minutes.
// Tag allows on-demand revalidation when users/registrations/awards are mutated.
export const getCachedAdminStatistics = unstable_cache(viewAdminStatistics, ['admin-statistics'], {
  revalidate: 600,
  tags: ['admin-statistics']
});
