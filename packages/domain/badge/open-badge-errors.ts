export type OpenBadgeErrorCode =
  | 'openBadge.assign.unauthorized'
  | 'openBadge.assign.awarderNotFound'
  | 'openBadge.assign.targetNotFound'
  | 'openBadge.assign.invalidLevelTransition'
  | 'openBadge.status.attachedToMachines'
  | 'openBadge.update.notFound'
  | 'openBadge.status.notFound'
  | 'openBadge.delete.notFound'
  | 'openBadge.delete.alreadyAssigned';

export class OpenBadgeError extends Error {
  readonly code: OpenBadgeErrorCode;

  constructor(code: OpenBadgeErrorCode, message?: string) {
    super(message ?? code);
    this.name = 'OpenBadgeError';
    this.code = code;
  }
}

export const isOpenBadgeError = (error: unknown): error is OpenBadgeError =>
  error instanceof OpenBadgeError;
