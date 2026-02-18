export const isPrismaUniqueConstraintError = (error: unknown): error is { code: string } => {
  if (!error || typeof error !== 'object') {
    return false;
  }

  return 'code' in error && (error as { code?: string }).code === 'P2002';
};
