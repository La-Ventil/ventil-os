export type OpenBadgeErrorCode =
  | 'openBadge.assign.unauthorized'
  | 'openBadge.assign.awarderNotFound'
  | 'openBadge.assign.targetNotFound'
  | 'openBadge.update.notFound';

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
