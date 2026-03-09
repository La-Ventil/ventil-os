import type { JSX } from 'react';
import Link from 'next/link';
import styles from '../docs.module.css';
import MarkdownRenderer from '../../components/markdown-renderer';
import {
  formatDocLabel,
  readSectionDocument,
  resolveSectionRoute,
  rootReferences,
  sectionLabels,
  userDocLocales,
  type SectionKey,
  type UserDocLocale
} from '../../lib/content';

const isActiveLink = (currentHref: string, href: string): boolean => currentHref === href;
const linkClassName = (isActive: boolean): string => `${styles.navLink}${isActive ? ` ${styles.activeLink}` : ''}`;

type BreadcrumbItem = {
  label: string;
  href: string | null;
};

const buildBreadcrumb = (
  section: SectionKey,
  routePrefix: string,
  slug: string[],
  locale: UserDocLocale | null
): BreadcrumbItem[] => {
  const items: BreadcrumbItem[] = [
    { label: 'Docs', href: '/' },
    { label: sectionLabels[section], href: `/${section}` }
  ];

  if (locale) {
    items.push({
      label: userDocLocales[locale],
      href: routePrefix
    });
  }

  const route: string[] = [];
  for (const segment of slug) {
    route.push(segment);
    items.push({
      label: formatDocLabel(segment),
      href: `${routePrefix}/${route.join('/')}`
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

const sectionDescription = (section: SectionKey): string => {
  if (section === 'user') {
    return 'Practical guides for creating your account, booking machines, and understanding your badges.';
  }

  if (section === 'admin') {
    return 'Operational guides for running Ventil O.S. in production.';
  }

  return 'Architecture, testing, ADRs, and contribution workflows.';
};

const emptyStateText = (locale: UserDocLocale | null): string =>
  locale === 'fr'
    ? "Aucun README n'est encore disponible pour ce dossier."
    : 'No README was found for this directory yet.';

const renderUserLanguageHome = (): JSX.Element => (
  <main className={styles.page}>
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <Link href="/" className={styles.brand}>
          Ventil O.S. Docs
        </Link>
        <h1 className={styles.sidebarTitle}>{sectionLabels.user}</h1>
        <p className={styles.sidebarText}>
          Choose a language to read user-facing guides. French is the default for the high-school audience.
        </p>
        <span className={styles.sectionLabel}>Languages</span>
        <nav className={styles.nav} aria-label="User guide languages">
          {Object.entries(userDocLocales).map(([locale, label]) => (
            <Link key={locale} href={`/user/${locale}`} className={styles.navLink}>
              <span className={styles.navLabel}>{label}</span>
              <span className={styles.navMeta}>User documentation</span>
            </Link>
          ))}
        </nav>
      </aside>

      <section className={styles.content}>
        <header className={styles.header}>
          <span className={styles.eyebrow}>User Help</span>
          <h2 className={styles.title}>Choose your language</h2>
          <p className={styles.description}>
            User help is available in French and English. Pick one language to keep navigation and links consistent.
          </p>
        </header>
        <div className={styles.grid}>
          {Object.entries(userDocLocales).map(([locale, label]) => (
            <article key={locale} className={styles.card}>
              <Link href={`/user/${locale}`} className={styles.homeLink}>
                <span className={styles.entryTitle}>{label}</span>
                <span className={styles.entryMeta}>Open the user guides in {label}.</span>
              </Link>
            </article>
          ))}
        </div>
      </section>
    </div>
  </main>
);

export const renderSectionDocument = async (section: SectionKey, routeSlug: string[] = []): Promise<JSX.Element> => {
  const sectionRoute = resolveSectionRoute(section, routeSlug);
  if (section === 'user' && sectionRoute.locale === null) {
    return renderUserLanguageHome();
  }

  const document = await readSectionDocument(section, sectionRoute.contentSlug, {
    locale: sectionRoute.locale ?? undefined,
    routePrefix: sectionRoute.routePrefix
  });

  const currentHref =
    sectionRoute.contentSlug.length === 0
      ? sectionRoute.routePrefix
      : `${sectionRoute.routePrefix}/${sectionRoute.contentSlug.join('/')}`;
  const breadcrumb = buildBreadcrumb(section, sectionRoute.routePrefix, sectionRoute.contentSlug, sectionRoute.locale);

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <aside className={styles.sidebar}>
          <Link href="/" className={styles.brand}>
            Ventil O.S. Docs
          </Link>
          <h1 className={styles.sidebarTitle}>{sectionLabels[section]}</h1>
          <p className={styles.sidebarText}>{sectionDescription(section)}</p>

          {sectionRoute.locale ? (
            <>
              <span className={styles.sectionLabel}>Language</span>
              <nav className={styles.secondaryNav} aria-label="User guide language">
                {Object.entries(userDocLocales).map(([locale, label]) => (
                  <Link
                    key={locale}
                    href={`/user/${locale}`}
                    className={`${styles.secondaryLink}${sectionRoute.locale === locale ? ` ${styles.activeLink}` : ''}`}
                    aria-current={sectionRoute.locale === locale ? 'page' : undefined}
                  >
                    <span className={styles.secondaryLabel}>{label}</span>
                  </Link>
                ))}
              </nav>
            </>
          ) : null}

          <span className={styles.sectionLabel}>In this section</span>
          <nav className={styles.nav} aria-label={`${sectionLabels[section]} navigation`}>
            <Link
              href={sectionRoute.routePrefix}
              className={linkClassName(isActiveLink(currentHref, sectionRoute.routePrefix))}
              aria-current={isActiveLink(currentHref, sectionRoute.routePrefix) ? 'page' : undefined}
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

          <span className={styles.sectionLabel}>Project references</span>
          <nav className={styles.secondaryNav} aria-label="Project references">
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
            <span className={styles.eyebrow}>
              {sectionRoute.locale ? `${section} • ${sectionRoute.locale}` : section}
            </span>
            <h2 className={styles.title}>{document.title}</h2>
            <p className={styles.description}>This page renders the canonical Markdown document from the repository.</p>
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
              <p className={styles.emptyState}>{emptyStateText(sectionRoute.locale)}</p>
            ) : null}
          </article>
        </section>
      </div>
    </main>
  );
};
