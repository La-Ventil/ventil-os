import type { JSX } from 'react';
import Link from 'next/link';
import styles from '../../docs.module.css';
import { getRootReferenceStaticParams, readRootReferenceDocument, rootReferences, sectionLabels } from '../../../lib/content';

export const dynamicParams = false;

export function generateStaticParams(): Array<{ name: string }> {
  return getRootReferenceStaticParams();
}

const renderLines = (content: string): JSX.Element[] =>
  content
    .split(/\r?\n/u)
    .map((line, index) => <p key={`${line}-${index}`}>{line === '' ? '\u00A0' : line}</p>);

type PageProps = {
  params: Promise<{ name: string }>;
};

export default async function ReferencePage({ params }: PageProps): Promise<JSX.Element> {
  const { name } = await params;
  const document = await readRootReferenceDocument(name);

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <aside className={styles.sidebar}>
          <Link href="/" className={styles.brand}>
            Ventil O.S. Docs
          </Link>
          <h1 className={styles.sidebarTitle}>Repository references</h1>
          <p className={styles.sidebarText}>Root-level repository documents that remain useful inside the docs app.</p>
          <nav className={styles.nav} aria-label="Repository references">
            {rootReferences.map((reference) => (
              <Link key={reference.key} href={`/reference/${reference.key}`} className={styles.navLink}>
                <span className={styles.navLabel}>{reference.label}</span>
                <span className={styles.navMeta}>{reference.description}</span>
              </Link>
            ))}
          </nav>
          <span className={styles.sectionLabel}>Audience sections</span>
          <nav className={styles.secondaryNav} aria-label="Audience sections">
            {Object.entries(sectionLabels).map(([key, label]) => (
              <Link key={key} href={`/${key}`} className={styles.secondaryLink}>
                <span className={styles.secondaryLabel}>{label}</span>
              </Link>
            ))}
          </nav>
        </aside>

        <section className={styles.content}>
          <header className={styles.header}>
            <span className={styles.eyebrow}>Reference</span>
            <h2 className={styles.title}>{document.title}</h2>
            <p className={styles.description}>This file stays at the repository root but is exposed here for convenience.</p>
          </header>

          <article className={styles.mainCard}>
            {document.sourceHref ? (
              <div className={styles.actions}>
                <Link href={document.sourceHref} className={styles.sourceLink}>
                  View source file
                </Link>
              </div>
            ) : null}
            <div className={styles.document}>{renderLines(document.content)}</div>
          </article>
        </section>
      </div>
    </main>
  );
}
