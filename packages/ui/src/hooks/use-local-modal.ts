'use client';

import { useCallback, useState } from 'react';

type UseLocalModalOptions = {
  initialOpen?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
};

export function useLocalModal({ initialOpen = false, onOpen, onClose }: UseLocalModalOptions = {}) {
  const [open, setOpen] = useState(initialOpen);

  const openModal = useCallback(() => {
    setOpen(true);
    onOpen?.();
  }, [onOpen]);

  const closeModal = useCallback(() => {
    setOpen(false);
    onClose?.();
  }, [onClose]);

  const toggleModal = useCallback(() => {
    setOpen((current) => {
      const next = !current;
      if (next) {
        onOpen?.();
      } else {
        onClose?.();
      }
      return next;
    });
  }, [onClose, onOpen]);

  return {
    open,
    setOpen,
    openModal,
    closeModal,
    toggleModal
  };
}
