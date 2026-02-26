'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import styles from './section-title.module.css';

export type SectionTitleProps = {
  icon?: React.ReactNode;
  children: React.ReactNode;
  id?: string;
};

export default function SectionTitle({ icon, children, id }: SectionTitleProps) {
  return (
    <Box className={styles.root}>
      {icon}
      <Typography variant="h1" id={id}>
        {children}
      </Typography>
    </Box>
  );
}
