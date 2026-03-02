import type { JSX } from 'react';
import Link from 'next/link';
import styles from './docs.module.css';
import { rootReferences, sectionLabels } from '../lib/content';

const sectionDescriptions: Record<keyof typeof sectionLabels, string> = {
  user: 'Help content for people using Ventil O.S. day to day.',
  admin: 'Operational guides for people managing the back office.',
  contributor: 'Engineering, architecture, testing, accessibility, and product references.'
};

export default function HomePage(): JSX.Element {
  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <aside className={styles.sidebar}>
          <span className={styles.brand}>Ventil O.S.</span>
          <h1 className={styles.sidebarTitle}>Documentation</h1>
          <p className={styles.sidebarText}>
            `docs/` remains the source of truth. This app is the reading layer for user, admin, and contributor
            documentation.
          </p>
          <nav className={styles.nav} aria-label="Main documentation sections">
            {Object.entries(sectionLabels).map(([key, label]) => (
              <Link key={key} href={`/${key}`} className={styles.navLink}>
                <span className={styles.navLabel}>{label}</span>
                <span className={styles.navMeta}>{sectionDescriptions[key as keyof typeof sectionLabels]}</span>
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
            <span className={styles.eyebrow}>Portal</span>
            <h2 className={styles.title}>Audience-first documentation</h2>
            <p className={styles.description}>
              The docs are split by audience so end users, admins, and contributors do not have to navigate the
              same level of detail.
            </p>
          </header>

          <div className={styles.grid}>
            {Object.entries(sectionLabels).map(([key, label]) => (
              <article key={key} className={styles.card}>
                <Link href={`/${key}`} className={styles.homeLink}>
                  <span className={styles.entryTitle}>{label}</span>
                  <span className={styles.entryMeta}>{sectionDescriptions[key as keyof typeof sectionLabels]}</span>
                </Link>
              </article>
            ))}
          </div>

          <header className={styles.header}>
            <span className={styles.eyebrow}>Repository</span>
            <h2 className={styles.title}>Useful project documents</h2>
            <p className={styles.description}>
              Root-level repository files remain visible from the docs app, while their long-lived content can move
              into `docs/` over time.
            </p>
          </header>

          <div className={styles.grid}>
            {rootReferences.map((reference) => (
              <article key={reference.key} className={styles.referenceCard}>
                <Link href={`/reference/${reference.key}`} className={styles.referenceLink}>
                  <span className={styles.referenceTitle}>{reference.label}</span>
                  <span className={styles.referenceMeta}>{reference.description}</span>
                </Link>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
