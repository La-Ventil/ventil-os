import path from 'path';
import { NextResponse } from 'next/server';
import { readUpload } from '@repo/storage/uploads';

const MIME_BY_EXTENSION: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp'
};

type RouteContext = {
  params: Promise<{ path: string[] }>;
};

export async function GET(_: Request, context: RouteContext) {
  const { path: segments } = await context.params;

  if (!Array.isArray(segments) || segments.length === 0) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const file = await readUpload(segments);
  if (!file) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const contentType = MIME_BY_EXTENSION[path.extname(segments.join('/')).toLowerCase()] ?? 'application/octet-stream';

  return new NextResponse(new Uint8Array(file), {
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=31536000, immutable'
    }
  });
}
