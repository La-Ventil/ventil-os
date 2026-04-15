import type { OpenBadgeViewModel } from '@repo/application/open-badges/models/open-badge';
import CardList from './card-list.server';
import ListEmptyState from './list-empty-state.server';
import OpenBadgeCard from './open-badge/open-badge-card.server';

export type OpenBadgeListServerProps = {
  badges: OpenBadgeViewModel[];
  getBadgeHref?: (badgeId: string) => string;
  emptyMessage?: string;
};

export default function OpenBadgeListServer({ badges, getBadgeHref, emptyMessage }: OpenBadgeListServerProps) {
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
