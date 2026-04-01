import fs from 'fs/promises';
import path from 'path';
import { NextResponse } from 'next/server';
import { getResolvedUploadRoot } from '@repo/storage/uploads';

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

  const uploadRoot = path.resolve(getResolvedUploadRoot());
  const resolvedPath = path.resolve(uploadRoot, ...segments);

  if (resolvedPath !== uploadRoot && !resolvedPath.startsWith(`${uploadRoot}${path.sep}`)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  try {
    const file = await fs.readFile(resolvedPath);
    const contentType = MIME_BY_EXTENSION[path.extname(resolvedPath).toLowerCase()] ?? 'application/octet-stream';

    return new NextResponse(new Uint8Array(file), {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable'
      }
    });
  } catch (error) {
    const err = error as NodeJS.ErrnoException;
    if (err.code === 'ENOENT' || err.code === 'ENOTDIR' || err.code === 'EISDIR') {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    throw error;
  }
}
