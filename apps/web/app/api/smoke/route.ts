import { checkDatabaseHealth } from '@repo/application/system/database-health.query';
import { buildHealthPayload } from '../_lib/health';

export const dynamic = 'force-dynamic';

export async function GET() {
  const payload = buildHealthPayload({
    app: { ok: true },
    database: await checkDatabaseHealth()
  });

  return Response.json(payload, {
    status: payload.ok ? 200 : 503,
    headers: { 'cache-control': 'no-store' }
  });
}
