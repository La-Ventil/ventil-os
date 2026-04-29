import { assertMemoryProfileAccess } from '../../../../lib/memory-profile';

export async function POST(request: Request) {
  const denied = assertMemoryProfileAccess(request);
  if (denied) {
    return denied;
  }

  if (typeof global.gc !== 'function') {
    return Response.json(
      { message: 'Garbage collection is unavailable. Start Node with --expose-gc.' },
      { status: 409 }
    );
  }

  global.gc();

  return Response.json({
    collectedAt: new Date().toISOString()
  });
}
