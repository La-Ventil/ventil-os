import fs from 'fs/promises';
import path from 'path';
import { NextResponse } from 'next/server';
import { resolveAvatarEditorCategoryIconPath } from '@repo/avatar-system/editor-assets';

type RouteContext = {
  params: Promise<{ filename: string }>;
};

export async function GET(_: Request, context: RouteContext) {
  const { filename } = await context.params;

  if (!filename || filename.includes('/') || filename.includes('\\')) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const resolvedPath = resolveAvatarEditorCategoryIconPath(filename);

  try {
    const file = await fs.readFile(resolvedPath);
    const contentType =
      path.extname(resolvedPath).toLowerCase() === '.svg' ? 'image/svg+xml' : 'application/octet-stream';

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
