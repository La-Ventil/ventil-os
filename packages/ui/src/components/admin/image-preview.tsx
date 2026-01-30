'use client';

import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

export type ImagePreviewProps = {
  label: string;
  preview?: string | null;
  placeholder?: string;
  id?: string;
};

const PreviewContainer = styled(Paper)(({ theme }) => ({
  width: theme.spacing(25),
  maxWidth: '100%',
  aspectRatio: '4 / 3',
  minHeight: theme.spacing(15),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden'
}));

export default function ImagePreview({ label, preview, placeholder, id }: ImagePreviewProps) {
  return (
    <PreviewContainer
      variant="outlined"
      aria-label={label}
      id={id}
      square
      data-has-preview={Boolean(preview)}
      sx={(theme) => ({ bgcolor: preview ? theme.palette.background.paper : theme.palette.action.hover })}
    >
      {preview ? (
        <Box
          component="img"
          src={preview}
          alt={label}
          sx={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
        />
      ) : (
        <Typography variant="caption" color="text.secondary" align="center" px={1}>
          {placeholder}
        </Typography>
      )}
    </PreviewContainer>
  );
}
