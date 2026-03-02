import { promises as fs } from 'node:fs';
import path from 'node:path';
import { notFound } from 'next/navigation';

export const sectionLabels = {
  user: 'User Documentation',
  admin: 'Admin Documentation',
  contributor: 'Contributor Documentation'
} as const;

export type SectionKey = keyof typeof sectionLabels;

type RootReference = {
  key: 'project' | 'changelog' | 'contributing';
  label: string;
  fileName: 'README.md' | 'CHANGELOG.md' | 'CONTRIBUTING.md';
  description: string;
};

export const rootReferences: RootReference[] = [
  {
    key: 'project',
    label: 'Project Overview',
    fileName: 'README.md',
    description: 'Repository overview, setup instructions, and monorepo structure.'
  },
  {
    key: 'changelog',
    label: 'Release Notes',
    fileName: 'CHANGELOG.md',
    description: 'Chronological release history and notable changes.'
  },
  {
    key: 'contributing',
    label: 'Contributing',
    fileName: 'CONTRIBUTING.md',
    description: 'Short repository-level contribution entry point.'
  }
];

const repoRootCandidates = [path.resolve(process.cwd()), path.resolve(process.cwd(), '..', '..')];

const isSectionKey = (value: string): value is SectionKey => value in sectionLabels;

const fileExists = async (filePath: string): Promise<boolean> => {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
};

const resolveRepoRoot = async (): Promise<string> => {
  for (const candidate of repoRootCandidates) {
    if (await fileExists(path.join(candidate, 'docs'))) {
      return candidate;
    }
  }

  throw new Error('Unable to locate repository root for docs app.');
};

export const resolveDocsRoot = async (): Promise<string> => {
  const repoRoot = await resolveRepoRoot();
  return path.join(repoRoot, 'docs');
};

export const resolveSectionRoot = async (section: SectionKey): Promise<string> => {
  const docsRoot = await resolveDocsRoot();
  return path.join(docsRoot, section);
};

const ensureInsideRoot = (rootPath: string, targetPath: string): void => {
  const relative = path.relative(rootPath, targetPath);

  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    notFound();
  }
};

export const getSectionKey = (value: string): SectionKey => {
  if (!isSectionKey(value)) {
    notFound();
  }

  return value;
};

export const getRootReference = (name: string): RootReference => {
  const reference = rootReferences.find((entry) => entry.key === name);

  if (!reference) {
    notFound();
  }

  return reference;
};

const statSafe = async (targetPath: string): Promise<Awaited<ReturnType<typeof fs.stat>> | null> => {
  try {
    return await fs.stat(targetPath);
  } catch {
    return null;
  }
};

export type DirectoryEntry = {
  name: string;
  title: string;
  href: string;
  kind: 'directory' | 'markdown' | 'asset';
};

const toTitle = (name: string): string => name.replace(/\.md$/u, '').replace(/[-_]/gu, ' ');

const lastSegmentTitle = (slug: string[], fallback: string): string => {
  const lastSegment = slug.at(-1);
  return lastSegment ? toTitle(lastSegment) : fallback;
};

const collectDirectory = async (
  rootPath: string,
  slug: string[] = []
): Promise<{ directories: string[][]; markdownFiles: string[][]; filePaths: string[][] }> => {
  const targetPath = path.join(rootPath, ...slug);
  const targetStat = await statSafe(targetPath);

  if (!targetStat || !targetStat.isDirectory()) {
    return {
      directories: [],
      markdownFiles: [],
      filePaths: []
    };
  }

  const entries = await fs.readdir(targetPath, { withFileTypes: true });
  const directories: string[][] = [];
  const markdownFiles: string[][] = [];
  const filePaths: string[][] = [];

  for (const entry of entries) {
    if (entry.name.startsWith('.')) {
      continue;
    }

    const nextSlug = [...slug, entry.name];

    if (entry.isDirectory()) {
      directories.push(nextSlug);
      const nested = await collectDirectory(rootPath, nextSlug);
      directories.push(...nested.directories);
      markdownFiles.push(...nested.markdownFiles);
      filePaths.push(...nested.filePaths);
      continue;
    }

    filePaths.push(nextSlug);

    if (entry.name.endsWith('.md') && entry.name !== 'README.md') {
      markdownFiles.push(nextSlug);
    }
  }

  return { directories, markdownFiles, filePaths };
};

export const getSectionStaticParams = async (): Promise<Array<{ section: SectionKey; slug?: string[] }>> => {
  const params: Array<{ section: SectionKey; slug?: string[] }> = [];

  for (const section of Object.keys(sectionLabels) as SectionKey[]) {
    params.push({ section });

    const sectionRoot = await resolveSectionRoot(section);
    const collected = await collectDirectory(sectionRoot);

    params.push(...collected.directories.map((slug) => ({ section, slug })));
    params.push(...collected.markdownFiles.map((slug) => ({ section, slug })));
  }

  return params;
};

export const getDocsSourceStaticParams = async (): Promise<Array<{ slug: string[] }>> => {
  const docsRoot = await resolveDocsRoot();
  const params: Array<{ slug: string[] }> = [];

  for (const section of Object.keys(sectionLabels) as SectionKey[]) {
    const sectionRoot = path.join(docsRoot, section);
    const collected = await collectDirectory(sectionRoot);

    params.push({ slug: [section, 'README.md'] });
    params.push(...collected.filePaths.map((slug) => ({ slug: [section, ...slug] })));
  }

  return params;
};

export const getRootReferenceStaticParams = (): Array<{ name: RootReference['key'] }> =>
  rootReferences.map((reference) => ({ name: reference.key }));

export const listSectionEntries = async (section: SectionKey, slug: string[] = []): Promise<DirectoryEntry[]> => {
  const sectionRoot = await resolveSectionRoot(section);
  const targetPath = path.join(sectionRoot, ...slug);
  ensureInsideRoot(sectionRoot, targetPath);

  const targetStat = await statSafe(targetPath);
  if (!targetStat || !targetStat.isDirectory()) {
    return [];
  }

  const entries = await fs.readdir(targetPath, { withFileTypes: true });

  return entries
    .filter((entry) => !entry.name.startsWith('.'))
    .filter((entry) => entry.name !== 'README.md')
    .map((entry) => {
      const nextSlug = [...slug, entry.name];
      const href = `/${section}/${nextSlug.join('/')}`;

      if (entry.isDirectory()) {
        return {
          name: entry.name,
          title: toTitle(entry.name),
          href,
          kind: 'directory' as const
        };
      }

      if (entry.name.endsWith('.md')) {
        return {
          name: entry.name,
          title: toTitle(entry.name),
          href,
          kind: 'markdown' as const
        };
      }

      return {
        name: entry.name,
        title: entry.name,
        href: `/source/docs/${section}/${nextSlug.join('/')}`,
        kind: 'asset' as const
      };
    })
    .sort((left, right) => left.title.localeCompare(right.title, 'en'));
};

export type DocumentData = {
  title: string;
  sourceHref: string | null;
  content: string;
  entries: DirectoryEntry[];
};

const buildMarkdownDocument = async (
  targetPath: string,
  sourceHref: string,
  titleFallback: string,
  entries: DirectoryEntry[]
): Promise<DocumentData> => ({
  title: titleFallback,
  sourceHref,
  content: await fs.readFile(targetPath, 'utf8'),
  entries
});

export const readSectionDocument = async (section: SectionKey, slug: string[] = []): Promise<DocumentData> => {
  const sectionRoot = await resolveSectionRoot(section);
  const targetPath = path.join(sectionRoot, ...slug);
  ensureInsideRoot(sectionRoot, targetPath);

  const targetStat = await statSafe(targetPath);
  if (!targetStat) {
    notFound();
  }

  if (targetStat.isDirectory()) {
    const readmePath = path.join(targetPath, 'README.md');
    const entries = await listSectionEntries(section, slug);

    if (!(await fileExists(readmePath))) {
      return {
        title: lastSegmentTitle(slug, sectionLabels[section]),
        sourceHref: null,
        content: '',
        entries
      };
    }

    return buildMarkdownDocument(
      readmePath,
      `/source/docs/${section}/${[...slug, 'README.md'].join('/')}`,
      lastSegmentTitle(slug, sectionLabels[section]),
      entries
    );
  }

  if (!targetPath.endsWith('.md')) {
    notFound();
  }

  return buildMarkdownDocument(
    targetPath,
    `/source/docs/${section}/${slug.join('/')}`,
    toTitle(slug[slug.length - 1] ?? section),
    []
  );
};

export const readRootReferenceDocument = async (name: string): Promise<DocumentData> => {
  const reference = getRootReference(name);
  const repoRoot = await resolveRepoRoot();
  const targetPath = path.join(repoRoot, reference.fileName);

  if (!(await fileExists(targetPath))) {
    notFound();
  }

  return {
    title: reference.label,
    sourceHref: `/source/root/${reference.key}`,
    content: await fs.readFile(targetPath, 'utf8'),
    entries: []
  };
};

export const readDocsSourceFile = async (slug: string[]): Promise<{ buffer: Buffer; fileName: string }> => {
  const docsRoot = await resolveDocsRoot();
  const targetPath = path.join(docsRoot, ...slug);
  ensureInsideRoot(docsRoot, targetPath);

  const targetStat = await statSafe(targetPath);
  if (!targetStat || !targetStat.isFile()) {
    notFound();
  }

  return {
    buffer: await fs.readFile(targetPath),
    fileName: path.basename(targetPath)
  };
};

export const readRootSourceFile = async (name: string): Promise<{ buffer: Buffer; fileName: string }> => {
  const reference = getRootReference(name);
  const repoRoot = await resolveRepoRoot();
  const targetPath = path.join(repoRoot, reference.fileName);

  if (!(await fileExists(targetPath))) {
    notFound();
  }

  return {
    buffer: await fs.readFile(targetPath),
    fileName: reference.fileName
  };
};

export const contentTypeFor = (fileName: string): string => {
  if (fileName.endsWith('.md')) {
    return 'text/markdown; charset=utf-8';
  }
  if (fileName.endsWith('.csv')) {
    return 'text/csv; charset=utf-8';
  }
  if (fileName.endsWith('.png')) {
    return 'image/png';
  }
  if (fileName.endsWith('.jpg') || fileName.endsWith('.jpeg')) {
    return 'image/jpeg';
  }
  if (fileName.endsWith('.svg')) {
    return 'image/svg+xml';
  }

  return 'application/octet-stream';
};
