import type { OpenBadge, OpenBadgeLevel } from '@repo/domain/badge/open-badge';

export type OpenBadgeLevelViewModel = OpenBadgeLevel & { label: string };
export type OpenBadgeViewModel = Omit<OpenBadge, 'levels'> & { levels: OpenBadgeLevelViewModel[] };
