import type { JSX } from 'react';
import Link from 'next/link';
import styles from '../docs.module.css';
import { readSectionDocument, rootReferences, sectionLabels, type SectionKey } from '../../lib/content';

const renderMarkdown = (content: string): JSX.Element[] => {
  const lines = content.split(/\r?\n/u);
  const nodes: JSX.Element[] = [];
  let paragraph: string[] = [];
  let listItems: string[] = [];
  let codeLines: string[] = [];
  let inCodeBlock = false;

  const flushParagraph = () => {
    if (paragraph.length === 0) {
      return;
    }

    nodes.push(<p key={`p-${nodes.length}`}>{paragraph.join(' ')}</p>);
    paragraph = [];
  };

  const flushList = () => {
    if (listItems.length === 0) {
      return;
    }

    nodes.push(
      <ul key={`ul-${nodes.length}`}>
        {listItems.map((item, index) => (
          <li key={`${item}-${index}`}>{item}</li>
        ))}
      </ul>
    );
    listItems = [];
  };

  const flushCode = () => {
    if (codeLines.length === 0) {
      return;
    }

    nodes.push(
      <pre key={`pre-${nodes.length}`}>
        <code>{codeLines.join('\n')}</code>
      </pre>
    );
    codeLines = [];
  };

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();
    const trimmed = line.trim();

    if (trimmed.startsWith('```')) {
      flushParagraph();
      flushList();
      if (inCodeBlock) {
        flushCode();
      }
      inCodeBlock = !inCodeBlock;
      continue;
    }

    if (inCodeBlock) {
      codeLines.push(line);
      continue;
    }

    if (trimmed === '') {
      flushParagraph();
      flushList();
      continue;
    }

    if (trimmed.startsWith('- ')) {
      flushParagraph();
      listItems.push(trimmed.slice(2));
      continue;
    }

    flushList();

    if (trimmed.startsWith('# ')) {
      flushParagraph();
      nodes.push(<h1 key={`h1-${nodes.length}`}>{trimmed.slice(2)}</h1>);
      continue;
    }

    if (trimmed.startsWith('## ')) {
      flushParagraph();
      nodes.push(<h2 key={`h2-${nodes.length}`}>{trimmed.slice(3)}</h2>);
      continue;
    }

    if (trimmed.startsWith('### ')) {
      flushParagraph();
      nodes.push(<h3 key={`h3-${nodes.length}`}>{trimmed.slice(4)}</h3>);
      continue;
    }

    paragraph.push(trimmed);
  }

  flushParagraph();
  flushList();
  flushCode();

  return nodes;
};

export const renderSectionDocument = async (section: SectionKey, slug: string[] = []): Promise<JSX.Element> => {
  const document = await readSectionDocument(section, slug);

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <aside className={styles.sidebar}>
          <Link href="/" className={styles.brand}>
            Ventil O.S. Docs
          </Link>
          <h1 className={styles.sidebarTitle}>{sectionLabels[section]}</h1>
          <p className={styles.sidebarText}>Read the section overview, then drill down into files and nested directories.</p>
          <nav className={styles.nav} aria-label={`${sectionLabels[section]} navigation`}>
            <Link href={`/${section}`} className={styles.navLink}>
              <span className={styles.navLabel}>Section home</span>
              <span className={styles.navMeta}>{sectionLabels[section]}</span>
            </Link>
            {document.entries.map((entry) => (
              <Link key={entry.href} href={entry.href} className={styles.navLink}>
                <span className={styles.navLabel}>{entry.title}</span>
                <span className={styles.navMeta}>{entry.kind}</span>
              </Link>
            ))}
          </nav>
          <span className={styles.sectionLabel}>Repository references</span>
          <nav className={styles.secondaryNav} aria-label="Repository references">
            {rootReferences.map((reference) => (
              <Link key={reference.key} href={`/reference/${reference.key}`} className={styles.secondaryLink}>
                <span className={styles.secondaryLabel}>{reference.label}</span>
                <span className={styles.secondaryMeta}>{reference.description}</span>
              </Link>
            ))}
          </nav>
        </aside>

        <section className={styles.content}>
          <header className={styles.header}>
            <span className={styles.eyebrow}>{section}</span>
            <h2 className={styles.title}>{document.title}</h2>
            <p className={styles.description}>
              This view reads the canonical file directly from `docs/` and exposes its sibling entries.
            </p>
          </header>

          <article className={styles.mainCard}>
            {document.sourceHref ? (
              <div className={styles.actions}>
                <Link href={document.sourceHref} className={styles.sourceLink}>
                  View source file
                </Link>
              </div>
            ) : null}
            <div className={styles.document}>{renderMarkdown(document.content)}</div>

            {document.entries.length > 0 ? (
              <div className={styles.entryList}>
                {document.entries.map((entry) => (
                  <Link key={entry.href} href={entry.href} className={styles.entryLink}>
                    <span className={styles.entryTitle}>{entry.title}</span>
                    <span className={styles.entryMeta}>{entry.kind}</span>
                  </Link>
                ))}
              </div>
            ) : document.content === '' ? (
              <p className={styles.emptyState}>No README was found for this directory yet.</p>
            ) : null}
          </article>
        </section>
      </div>
    </main>
  );
};
