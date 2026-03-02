import type { JSX } from 'react';
import { getSectionKey, getSectionStaticParams } from '../../../lib/content';
import { renderSectionDocument } from '../section-document';

export const dynamicParams = false;

export async function generateStaticParams(): Promise<Array<{ section: string; slug: string[] }>> {
  const params = await getSectionStaticParams();
  return params.flatMap((entry) => (entry.slug ? [{ section: entry.section, slug: entry.slug }] : []));
}

type PageProps = {
  params: Promise<{ section: string; slug: string[] }>;
};

export default async function SectionDocumentPage({ params }: PageProps): Promise<JSX.Element> {
  const resolvedParams = await params;
  return renderSectionDocument(getSectionKey(resolvedParams.section), resolvedParams.slug);
}
