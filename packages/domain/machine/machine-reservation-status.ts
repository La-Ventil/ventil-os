export enum MachineReservationStatus {
  Confirmed = 'confirmed',
  Cancelled = 'cancelled'
}

export const toMachineReservationStatus = (status: string | MachineReservationStatus): MachineReservationStatus =>
  status === MachineReservationStatus.Confirmed
    ? MachineReservationStatus.Confirmed
    : MachineReservationStatus.Cancelled;

export const isReservationConfirmed = (status: MachineReservationStatus | string): boolean =>
  status === MachineReservationStatus.Confirmed;
