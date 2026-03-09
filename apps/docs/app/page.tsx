import type { JSX } from 'react';
import Link from 'next/link';
import styles from './docs.module.css';
import { rootReferences, sectionLabels, userDocLocales } from '../lib/content';

const sectionDescriptions: Record<keyof typeof sectionLabels, string> = {
  user: 'Step-by-step help for students and other users of the platform.',
  admin: 'Operational playbooks for people running the back office.',
  contributor: 'Architecture, testing, accessibility, and product references.'
};

export default function HomePage(): JSX.Element {
  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <aside className={styles.sidebar}>
          <span className={styles.brand}>Ventil O.S.</span>
          <h1 className={styles.sidebarTitle}>Help & Documentation</h1>
          <p className={styles.sidebarText}>
            Start here for user help. Admin and contributor sections remain available for operational and technical
            documentation.
          </p>
          <span className={styles.sectionLabel}>Main sections</span>
          <nav className={styles.nav} aria-label="Main documentation sections">
            {Object.entries(sectionLabels).map(([key, label]) => (
              <Link key={key} href={`/${key}`} className={styles.navLink}>
                <span className={styles.navLabel}>{label}</span>
                <span className={styles.navMeta}>{sectionDescriptions[key as keyof typeof sectionLabels]}</span>
              </Link>
            ))}
          </nav>

          <span className={styles.sectionLabel}>User languages</span>
          <nav className={styles.secondaryNav} aria-label="User documentation languages">
            {Object.entries(userDocLocales).map(([locale, label]) => (
              <Link key={locale} href={`/user/${locale}`} className={styles.secondaryLink}>
                <span className={styles.secondaryLabel}>{label}</span>
                <span className={styles.secondaryMeta}>User help</span>
              </Link>
            ))}
          </nav>
        </aside>
        <section className={styles.content}>
          <header className={styles.header}>
            <span className={styles.eyebrow}>User Help</span>
            <h2 className={styles.title}>Get help with Ventil O.S.</h2>
            <p className={styles.description}>
              Use these guides to get started quickly: account creation, machine reservations, open badges, and profile
              management.
            </p>
          </header>

          <div className={styles.grid}>
            <article className={styles.card}>
              <Link href="/user/fr/getting-started" className={styles.homeLink}>
                <span className={styles.entryTitle}>Commencer (FR)</span>
                <span className={styles.entryMeta}>Parcours de démarrage pour les utilisateurs francophones.</span>
              </Link>
            </article>
            <article className={styles.card}>
              <Link href="/user/fr/machine-reservations" className={styles.homeLink}>
                <span className={styles.entryTitle}>Réserver une machine</span>
                <span className={styles.entryMeta}>Choisir un créneau, modifier, annuler, libérer.</span>
              </Link>
            </article>
            <article className={styles.card}>
              <Link href="/user/en/getting-started" className={styles.homeLink}>
                <span className={styles.entryTitle}>Get Started (EN)</span>
                <span className={styles.entryMeta}>Quick onboarding for English-speaking users.</span>
              </Link>
            </article>
            <article className={styles.card}>
              <Link href="/user/en/open-badges" className={styles.homeLink}>
                <span className={styles.entryTitle}>Understand Open Badges</span>
                <span className={styles.entryMeta}>Levels, progress, and earned badges in your profile.</span>
              </Link>
            </article>
          </div>

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
            <span className={styles.eyebrow}>Project</span>
            <h2 className={styles.title}>Technical and project references</h2>
            <p className={styles.description}>These documents are mostly intended for maintainers and contributors.</p>
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
