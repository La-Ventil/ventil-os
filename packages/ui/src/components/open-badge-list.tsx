import type { OpenBadgeViewModel } from '@repo/view-models/open-badge';
import CardList from './card-list';
import OpenBadgeCard from './open-badge/open-badge-card';
import ListEmptyState from './list-empty-state';

export type OpenBadgeListProps = {
  badges: OpenBadgeViewModel[];
  getBadgeHref?: (badgeId: string) => string;
  emptyMessage?: string;
};

export default function OpenBadgeList({ badges, getBadgeHref, emptyMessage }: OpenBadgeListProps) {
  return (
    <CardList>
      {badges.length ? (
        badges.map((badge) => (
          <OpenBadgeCard key={badge.id} badge={badge} href={getBadgeHref ? getBadgeHref(badge.id) : undefined} />
        ))
      ) : emptyMessage ? (
        <ListEmptyState title={emptyMessage} />
      ) : null}
    </CardList>
  );
}
