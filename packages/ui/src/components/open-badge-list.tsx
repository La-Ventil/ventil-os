import type { OpenBadgeViewModel } from '@repo/view-models/open-badge';
import CardList from './card-list';
import OpenBadgeCard from './open-badge/open-badge-card';

export type OpenBadgeListProps = {
  badges: OpenBadgeViewModel[];
  getBadgeHref?: (badgeId: string) => string;
};

export default function OpenBadgeList({ badges, getBadgeHref }: OpenBadgeListProps) {
  return (
    <CardList>
      {badges.map((badge) => (
        <OpenBadgeCard key={badge.id} badge={badge} href={getBadgeHref ? getBadgeHref(badge.id) : undefined} />
      ))}
    </CardList>
  );
}
