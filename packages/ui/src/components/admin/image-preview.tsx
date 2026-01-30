'use client';

import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import clsx from 'clsx';
import styles from './image-preview.module.css';

export type ImagePreviewProps = {
  label: string;
  preview?: string | null;
  placeholder?: string;
  id?: string;
};

export default function ImagePreview({ label, preview, placeholder, id }: ImagePreviewProps) {
  return (
    <Paper
      variant="outlined"
      aria-label={label}
      id={id}
      square
      data-has-preview={Boolean(preview)}
      className={styles.container}
    >
      {preview ? (
        <Box component="img" src={preview} alt={label} className={styles.image} />
      ) : (
        <Typography variant="caption" color="text.secondary" align="center" px={1}>
          {placeholder}
        </Typography>
      )}
    </Paper>
  );
}
