'use client';
import type { JSX } from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { OpenBadgeViewModel } from '@repo/view-models/open-badge';
import OpenBadgeModal from './open-badge-modal';

type OpenBadgeModalRouteProps = {
  openBadge: OpenBadgeViewModel | null;
  closeHref: string;
};

export default function OpenBadgeModalRoute({
  openBadge,
  closeHref
}: OpenBadgeModalRouteProps): JSX.Element | null {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(Boolean(openBadge));

  useEffect(() => {
    setIsOpen(Boolean(openBadge));
  }, [openBadge]);

  return (
    <OpenBadgeModal
      openBadge={openBadge}
      open={isOpen}
      onClose={() => {
        setIsOpen(false);
        router.push(closeHref);
      }}
    />
  );
}
