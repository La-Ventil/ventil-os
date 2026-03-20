import type { MachineModalTab, ReservationStep } from './machine-reservation-modal.state';

type BuildMachineHrefParams = {
  modalPath: string;
  tab?: MachineModalTab;
  step?: ReservationStep | null;
  at?: string | null;
  reservationId?: string | null;
};

export const buildMachineModalHref = ({ modalPath, tab, step, at, reservationId }: BuildMachineHrefParams): string => {
  const searchParams = new URLSearchParams();

  if (tab) {
    searchParams.set('tab', tab);
  }

  if (tab === 'reservations') {
    const normalizedStep = reservationId ? 'edit' : (step ?? 'schedule');
    searchParams.set('step', normalizedStep);

    if (normalizedStep !== 'edit' && at) {
      searchParams.set('at', at);
    }
  }

  if (reservationId) {
    searchParams.set('reservationId', reservationId);
  }

  const query = searchParams.toString();
  return query ? `${modalPath}?${query}` : modalPath;
};

export const replaceBrowserUrl = (href: string) => {
  if (typeof window === 'undefined') {
    return;
  }

  window.history.replaceState(window.history.state, '', href);
};
