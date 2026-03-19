'use client';
import type { JSX } from 'react';
import type { OpenBadgeViewModel } from '@repo/application/open-badges/models/open-badge';
import { useRouteModal } from '../../hooks/use-route-modal';
import OpenBadgeModal from './open-badge-modal';

type OpenBadgeModalRouteProps = {
  openBadge: OpenBadgeViewModel | null;
  closeHref: string;
};

export default function OpenBadgeModalRoute({ openBadge, closeHref }: OpenBadgeModalRouteProps): JSX.Element | null {
  const modalPath = openBadge ? `${closeHref}/${openBadge.id}` : null;
  const { open, handleClose } = useRouteModal({
    modalPath,
    closeHref
  });

  return <OpenBadgeModal openBadge={openBadge} open={open} onClose={handleClose} />;
}
