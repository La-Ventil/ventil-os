import type { DatabaseHealth } from '@repo/application/system/database-health.query';

type HealthCheck = {
  ok: boolean;
  latencyMs?: number;
};

export type HealthPayload = {
  ok: boolean;
  service: 'web';
  environment: string;
  commitId: string | null;
  timestamp: string;
  checks: {
    app: HealthCheck;
    database?: DatabaseHealth;
  };
};

export function buildHealthPayload(checks: HealthPayload['checks']): HealthPayload {
  return {
    ok: Object.values(checks).every((check) => check.ok),
    service: 'web',
    // Clever Cloud injects COMMIT_ID at deploy time, so a probe tells which build is answering.
    environment: process.env.NODE_ENV ?? 'unknown',
    commitId: process.env.COMMIT_ID ?? null,
    timestamp: new Date().toISOString(),
    checks
  };
}
