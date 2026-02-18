export type UserErrorCode = 'user.notFound';

export class UserError extends Error {
  readonly code: UserErrorCode;

  constructor(code: UserErrorCode, message?: string) {
    super(message ?? code);
    this.name = 'UserError';
    this.code = code;
  }
}

export const isUserError = (error: unknown): error is UserError => error instanceof UserError;
