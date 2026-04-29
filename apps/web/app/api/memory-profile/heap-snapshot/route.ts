import path from 'node:path';
import { writeHeapSnapshot } from 'node:v8';
import {
  assertMemoryProfileAccess,
  resolveMemoryProfileOutputDir,
  sanitizeMemoryProfileLabel
} from '../../../../lib/memory-profile';

type HeapSnapshotRequest = {
  label?: string;
};

export async function POST(request: Request) {
  const denied = assertMemoryProfileAccess(request);
  if (denied) {
    return denied;
  }

  const body = ((await request.json().catch(() => ({}))) ?? {}) as HeapSnapshotRequest;
  const label = sanitizeMemoryProfileLabel(body.label);
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const outputDir = resolveMemoryProfileOutputDir();
  const filename = path.join(outputDir, `${timestamp}-${label}.heapsnapshot`);
  const writtenFile = writeHeapSnapshot(filename);

  return Response.json({
    capturedAt: new Date().toISOString(),
    file: writtenFile
  });
}
