import { buildHealthPayload } from '../_lib/health';

export const dynamic = 'force-dynamic';

export function GET() {
  return Response.json(
    buildHealthPayload({
      app: { ok: true }
    }),
    {
      headers: { 'cache-control': 'no-store' }
    }
  );
}
