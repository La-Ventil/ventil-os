'use client';

import Typography from '@mui/material/Typography';
import styles from './section-subtitle.module.css';

export type SectionSubtitleProps = {
  children: React.ReactNode;
  className?: string;
};

export default function SectionSubtitle({ children, className }: SectionSubtitleProps) {
  return (
    <Typography variant="h3" className={`${styles.root}${className ? ` ${className}` : ''}`}>
      {children}
    </Typography>
  );
}
