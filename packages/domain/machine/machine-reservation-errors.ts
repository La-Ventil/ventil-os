export type MachineReservationErrorCode =
  | 'machineReservation.inactive'
  | 'machineReservation.startsAtInPast'
  | 'machineReservation.overlap'
  | 'machineReservation.notFound'
  | 'machineReservation.unauthorized'
  | 'machineReservation.badgeRequired'
  | 'machineReservation.machineRequired';

export class MachineReservationError extends Error {
  readonly code: MachineReservationErrorCode;

  constructor(code: MachineReservationErrorCode, message?: string) {
    super(message ?? code);
    this.name = 'MachineReservationError';
    this.code = code;
  }
}

export const isMachineReservationError = (error: unknown): error is MachineReservationError =>
  error instanceof MachineReservationError;
