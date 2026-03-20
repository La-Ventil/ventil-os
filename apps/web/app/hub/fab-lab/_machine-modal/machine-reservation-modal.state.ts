import type { MachineReservationViewModel } from '@repo/application/machines/models/machine-reservation';

export type ReservationStep = 'schedule' | 'create' | 'edit';
export type MachineModalTab = 'info' | 'reservations';

export type MachineReservationModalState =
  | { kind: 'info'; at: Date }
  | { kind: 'schedule'; at: Date }
  | { kind: 'create'; at: Date }
  | { kind: 'edit'; at: Date; reservation: MachineReservationViewModel };

export type MachineReservationModalEvent =
  | {
      type: 'HYDRATE_FROM_SERVER_CONTEXT';
      tab: MachineModalTab;
      focusedAt: Date;
      reservationStartAt: Date | null;
      reservation: MachineReservationViewModel | null;
    }
  | { type: 'OPEN_INFO' }
  | { type: 'OPEN_SCHEDULE'; at?: Date }
  | { type: 'CHANGE_DAY'; at: Date }
  | { type: 'OPEN_CREATE'; at: Date }
  | { type: 'OPEN_EDIT'; reservation: MachineReservationViewModel }
  | { type: 'CLOSE_FORM'; at?: Date };

export const createMachineReservationModalState = ({
  tab,
  focusedAt,
  reservationStartAt,
  reservation
}: {
  tab: MachineModalTab;
  focusedAt: Date;
  reservationStartAt: Date | null;
  reservation: MachineReservationViewModel | null;
}): MachineReservationModalState => {
  if (tab === 'info') {
    return { kind: 'info', at: focusedAt };
  }

  if (reservation) {
    return { kind: 'edit', at: reservation.startsAt, reservation };
  }

  if (reservationStartAt) {
    return { kind: 'create', at: reservationStartAt };
  }

  return { kind: 'schedule', at: focusedAt };
};

export const machineReservationModalReducer = (
  state: MachineReservationModalState,
  event: MachineReservationModalEvent
): MachineReservationModalState => {
  switch (event.type) {
    case 'HYDRATE_FROM_SERVER_CONTEXT':
      return createMachineReservationModalState({
        tab: event.tab,
        focusedAt: event.focusedAt,
        reservationStartAt: event.reservationStartAt,
        reservation: event.reservation
      });
    case 'OPEN_INFO':
      return { kind: 'info', at: state.at };
    case 'OPEN_SCHEDULE':
      return { kind: 'schedule', at: event.at ?? state.at };
    case 'CHANGE_DAY':
      return { kind: 'schedule', at: event.at };
    case 'OPEN_CREATE':
      return { kind: 'create', at: event.at };
    case 'OPEN_EDIT':
      return { kind: 'edit', at: event.reservation.startsAt, reservation: event.reservation };
    case 'CLOSE_FORM':
      return { kind: 'schedule', at: event.at ?? state.at };
    default:
      return state;
  }
};

export const getMachineModalTab = (state: MachineReservationModalState): MachineModalTab =>
  state.kind === 'info' ? 'info' : 'reservations';

export const getReservationStep = (state: MachineReservationModalState): ReservationStep => {
  switch (state.kind) {
    case 'create':
      return 'create';
    case 'edit':
      return 'edit';
    default:
      return 'schedule';
  }
};

export const getSelectedReservation = (state: MachineReservationModalState): MachineReservationViewModel | null =>
  state.kind === 'edit' ? state.reservation : null;
