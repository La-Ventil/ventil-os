'use client';

import Typography from '@mui/material/Typography';
import clsx from 'clsx';
import styles from './section-subtitle.module.css';

export type SectionSubtitleProps = {
  children: React.ReactNode;
  className?: string;
};

export default function SectionSubtitle({ children, className }: SectionSubtitleProps) {
  return (
    <Typography variant="h3" className={clsx(styles.root, className)}>
      {children}
    </Typography>
  );
}
