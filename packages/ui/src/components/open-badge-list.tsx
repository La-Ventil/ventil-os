import type { OpenBadgeViewModel } from '@repo/domain/view-models/open-badge';
import OpenBadgeCard from './open-badge-card';
import Section from './section';

export type OpenBadgeListProps = {
  badges: OpenBadgeViewModel[];
  getBadgeHref?: (badgeId: string) => string;
};

export default function OpenBadgeList({
  badges,
  getBadgeHref
}: OpenBadgeListProps) {
  return (
    <Section>
      {badges.map((badge) => (
        <OpenBadgeCard
          key={badge.id}
          badge={badge}
          href={getBadgeHref ? getBadgeHref(badge.id) : undefined}
        />
      ))}
    </Section>
  );
}
