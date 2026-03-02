import { NextResponse } from 'next/server';
import { contentTypeFor, getDocsSourceStaticParams, readDocsSourceFile } from '../../../../lib/content';

export const dynamic = 'force-static';
export const dynamicParams = false;

export async function generateStaticParams(): Promise<Array<{ slug: string[] }>> {
  return getDocsSourceStaticParams();
}

type RouteContext = {
  params: Promise<{ slug: string[] }>;
};

export async function GET(_: Request, context: RouteContext): Promise<NextResponse> {
  const { slug } = await context.params;
  const file = await readDocsSourceFile(slug);

  return new NextResponse(new Uint8Array(file.buffer), {
    headers: {
      'content-type': contentTypeFor(file.fileName),
      'content-disposition': `inline; filename="${file.fileName}"`
    }
  });
}
