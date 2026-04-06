import fs from 'fs/promises';
import path from 'path';
import { NextResponse } from 'next/server';
import { resolveAvatarEditorPreviewPath } from '@repo/avatar-system/editor-assets';

const MIME_BY_EXTENSION: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp'
};

type RouteContext = {
  params: Promise<{ filename: string }>;
};

export async function GET(_: Request, context: RouteContext) {
  const { filename } = await context.params;

  if (!filename || filename.includes('/') || filename.includes('\\')) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const resolvedPath = resolveAvatarEditorPreviewPath(filename);

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
