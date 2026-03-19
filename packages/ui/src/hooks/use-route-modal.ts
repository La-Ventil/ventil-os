'use client';

import { useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';

type UseRouteModalOptions = {
  modalPath: string | null;
  closeHref: string;
  refreshOnClose?: boolean;
  onCloseStart?: () => void;
};

export function useRouteModal({ modalPath, closeHref, refreshOnClose = false, onCloseStart }: UseRouteModalOptions) {
  const pathname = usePathname();
  const router = useRouter();
  const open = modalPath !== null && pathname === modalPath;

  const handleClose = useCallback(() => {
    onCloseStart?.();
    router.replace(closeHref);
    if (refreshOnClose) {
      router.refresh();
    }
  }, [closeHref, onCloseStart, refreshOnClose, router]);

  return {
    open,
    handleClose
  };
}
