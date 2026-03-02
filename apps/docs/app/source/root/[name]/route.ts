import { NextResponse } from 'next/server';
import { contentTypeFor, getRootReferenceStaticParams, readRootSourceFile } from '../../../../lib/content';

export const dynamic = 'force-static';
export const dynamicParams = false;

export function generateStaticParams(): Array<{ name: string }> {
  return getRootReferenceStaticParams();
}

type RouteContext = {
  params: Promise<{ name: string }>;
};

export async function GET(_: Request, context: RouteContext): Promise<NextResponse> {
  const { name } = await context.params;
  const file = await readRootSourceFile(name);

  return new NextResponse(new Uint8Array(file.buffer), {
    headers: {
      'content-type': contentTypeFor(file.fileName),
      'content-disposition': `inline; filename="${file.fileName}"`
    }
  });
}
