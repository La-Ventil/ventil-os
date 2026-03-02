import type { JSX } from 'react';
import { getSectionKey, sectionLabels } from '../../lib/content';
import { renderSectionDocument } from './section-document';

export const dynamicParams = false;

export function generateStaticParams(): Array<{ section: string }> {
  return Object.keys(sectionLabels).map((section) => ({ section }));
}

type PageProps = {
  params: Promise<{ section: string }>;
};

export default async function SectionHomePage({ params }: PageProps): Promise<JSX.Element> {
  const { section } = await params;
  return renderSectionDocument(getSectionKey(section));
}
