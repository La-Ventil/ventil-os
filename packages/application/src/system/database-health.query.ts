import { pingDatabase } from '@repo/db';

export type DatabaseHealth = {
  ok: boolean;
  latencyMs?: number;
};

/** Readiness probe: a failing database is reported, not thrown, so the caller can answer with a status code. */
export const checkDatabaseHealth = async (): Promise<DatabaseHealth> => {
  try {
    return { ok: true, latencyMs: await pingDatabase() };
  } catch {
    return { ok: false };
  }
};
