'use client';

import { useCallback, useEffect, useState } from 'react';
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
  // Closing navigates to the parent route, whose page is rendered on the server. Waiting for that
  // round-trip before hiding the dialog reads as an unresponsive close, so the dialog leaves first:
  // the content behind it is already on screen.
  const [closingFrom, setClosingFrom] = useState<string | null>(null);
  const open = modalPath !== null && pathname === modalPath && closingFrom !== pathname;

  useEffect(() => {
    if (closingFrom !== null && pathname !== closingFrom) {
      setClosingFrom(null);
    }
  }, [pathname, closingFrom]);

  const handleClose = useCallback(() => {
    onCloseStart?.();
    setClosingFrom(pathname);
    router.replace(closeHref);
    if (refreshOnClose) {
      router.refresh();
    }
  }, [closeHref, onCloseStart, pathname, refreshOnClose, router]);

  return {
    open,
    handleClose
  };
}
