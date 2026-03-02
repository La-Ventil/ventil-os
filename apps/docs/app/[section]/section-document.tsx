import type { JSX } from 'react';
import Link from 'next/link';
import styles from '../docs.module.css';
import MarkdownRenderer from '../../components/markdown-renderer';
import {
  formatDocLabel,
  readSectionDocument,
  rootReferences,
  sectionLabels,
  type SectionKey
} from '../../lib/content';

const isActiveLink = (currentHref: string, href: string): boolean => currentHref === href;
const linkClassName = (isActive: boolean): string => `${styles.navLink}${isActive ? ` ${styles.activeLink}` : ''}`;

type BreadcrumbItem = {
  label: string;
  href: string | null;
};

const buildBreadcrumb = (section: SectionKey, slug: string[]): BreadcrumbItem[] => {
  const items: BreadcrumbItem[] = [
    { label: 'Docs', href: '/' },
    { label: sectionLabels[section], href: `/${section}` }
  ];

  const route: string[] = [];
  for (const segment of slug) {
    route.push(segment);
    items.push({
      label: formatDocLabel(segment),
      href: `/${section}/${route.join('/')}`
    });
  }

  const lastIndex = items.length - 1;
  if (lastIndex >= 0) {
    const currentItem = items[lastIndex]!;
    items[lastIndex] = {
      ...currentItem,
      href: null
    };
  }

  return items;
};

export const renderSectionDocument = async (section: SectionKey, routeSlug: string[] = []): Promise<JSX.Element> => {
  const document = await readSectionDocument(section, routeSlug);
  const currentHref = routeSlug.length === 0 ? `/${section}` : `/${section}/${routeSlug.join('/')}`;
  const breadcrumb = buildBreadcrumb(section, routeSlug);

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
            <Link
              href={`/${section}`}
              className={linkClassName(isActiveLink(currentHref, `/${section}`))}
              aria-current={isActiveLink(currentHref, `/${section}`) ? 'page' : undefined}
            >
              <span className={styles.navLabel}>Section home</span>
              <span className={styles.navMeta}>{sectionLabels[section]}</span>
            </Link>
            {document.entries.map((entry) => (
              <Link
                key={entry.href}
                href={entry.href}
                className={linkClassName(isActiveLink(currentHref, entry.href))}
                aria-current={isActiveLink(currentHref, entry.href) ? 'page' : undefined}
              >
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
            <nav className={styles.breadcrumb} aria-label="Breadcrumb">
              {breadcrumb.map((item, index) =>
                item.href ? (
                  <span key={`${item.label}-${index}`} className={styles.breadcrumbItem}>
                    <Link href={item.href} className={styles.breadcrumbLink}>
                      {item.label}
                    </Link>
                  </span>
                ) : (
                  <span key={`${item.label}-${index}`} className={styles.breadcrumbCurrent} aria-current="page">
                    {item.label}
                  </span>
                )
              )}
            </nav>
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
            <div className={styles.document}>
              <MarkdownRenderer content={document.content} origin={document.origin} />
            </div>

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
