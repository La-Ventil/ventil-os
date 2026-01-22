'use client';
import type { JSX } from 'react';
import { useRouter } from 'next/navigation';
import type { OpenBadgeViewModel } from '@repo/domain/view-models/open-badge';
import OpenBadgeModal from '@repo/ui/open-badge-modal';

type OpenBadgeModalRouteProps = {
  openBadge: OpenBadgeViewModel | null;
  closeHref: string;
};

export default function OpenBadgeModalRoute({
  openBadge,
  closeHref
}: OpenBadgeModalRouteProps): JSX.Element | null {
  const router = useRouter();

  return (
    <OpenBadgeModal
      openBadge={openBadge}
      open={Boolean(openBadge)}
      onClose={() => router.push(closeHref)}
    />
  );
}
