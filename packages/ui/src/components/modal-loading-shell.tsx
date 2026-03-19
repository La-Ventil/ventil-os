'use client';

import type { JSX } from 'react';
import Skeleton from '@mui/material/Skeleton';
import ModalLayout from './modal-layout';
import { ThemeSection, type ThemeSection as ThemeSectionType } from '../theme';
import styles from './modal-loading-shell.module.css';

type ModalLoadingShellProps = {
  closeLabel: string;
  themeSection?: ThemeSectionType;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  fullWidth?: boolean;
  showMedia?: boolean;
  sectionCount?: number;
  showActions?: boolean;
};

export default function ModalLoadingShell({
  closeLabel,
  themeSection = ThemeSection.Admin,
  maxWidth = 'sm',
  fullWidth = true,
  showMedia = true,
  sectionCount = 2,
  showActions = false
}: ModalLoadingShellProps): JSX.Element {
  return (
    <ModalLayout
      open
      onClose={() => undefined}
      closeLabel={closeLabel}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      themeSection={themeSection}
    >
      <div className={styles.content} aria-busy="true" aria-live="polite">
        <div className={styles.header}>
          <Skeleton variant="text" width="60%" height={56} />
          <Skeleton variant="text" width="35%" height={28} />
        </div>

        {showMedia ? (
          <div className={styles.media}>
            <Skeleton variant="rectangular" width="100%" height={220} />
          </div>
        ) : null}

        {Array.from({ length: sectionCount }).map((_, index) => (
          <div key={index} className={styles.section}>
            <Skeleton variant="text" width="38%" height={26} />
            <Skeleton variant="text" width="100%" height={22} />
            <Skeleton variant="text" width="88%" height={22} />
            <Skeleton variant="text" width="72%" height={22} />
          </div>
        ))}

        {showActions ? (
          <div className={styles.actions}>
            <Skeleton variant="rounded" width="100%" height={44} />
            <Skeleton variant="rounded" width="100%" height={44} />
          </div>
        ) : null}
      </div>
    </ModalLayout>
  );
}
