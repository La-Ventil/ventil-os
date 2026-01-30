"use client";

import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import AdminButton from './admin-button';
import styles from './image-upload-field.module.css';
import { ChangeEvent, useEffect, useId, useRef, useState } from 'react';
import ImagePreview from './image-preview';

export type ImageUploadFieldProps = {
  label: string;
  placeholder: string;
  uploadLabel: string;
  required?: boolean;
  name?: string;
  fileName?: string;
  previewUrl?: string;
  accept?: string;
  defaultValue?: string;
  error?: boolean;
  helperText?: string;
  maxSizeMb?: number;
  clearLabel?: string;
  tooLargeLabel?: string;
  maxSizeHint?: string;
  onChange?: (payload: { file: File | null; preview: string | null }) => void;
};

export default function ImageUploadField({
  label,
  placeholder,
  uploadLabel,
  required = false,
  name = 'imageUrl',
  fileName = 'imageFile',
  previewUrl,
  accept = 'image/*',
  defaultValue,
  error = false,
  helperText,
  maxSizeMb = 5,
  clearLabel = 'Clear',
  tooLargeLabel,
  maxSizeHint,
  onChange
}: ImageUploadFieldProps) {
  const inputId = useId();
  const [preview, setPreview] = useState<string | null>(previewUrl || defaultValue || null);
  const [localError, setLocalError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const urlInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPreview(previewUrl || defaultValue || null);
  }, [defaultValue, previewUrl]);

  const notifyChange = (file: File | null, newPreview: string | null) => {
    onChange?.({ file, preview: newPreview });
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setLocalError(null);
      return;
    }

    const maxBytes = maxSizeMb * 1024 * 1024;
    if (file.size > maxBytes) {
      const formattedMax = `${maxSizeMb}MB`;
      setLocalError(tooLargeLabel ? tooLargeLabel.replace('{max}', formattedMax) : `File too large (max ${formattedMax}).`);
      event.target.value = '';
      notifyChange(null, preview);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    if (preview && preview.startsWith('blob:')) {
      URL.revokeObjectURL(preview);
    }
    setLocalError(null);
    setPreview(objectUrl);
    notifyChange(file, objectUrl);
  };

  const handleUrlChange = (event: ChangeEvent<HTMLInputElement>) => {
    const url = event.target.value.trim();
    setPreview(url || null);
    notifyChange(null, url || null);
  };

  const handleClear = () => {
    if (preview && preview.startsWith('blob:')) {
      URL.revokeObjectURL(preview);
    }
    setPreview(null);
    setLocalError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (urlInputRef.current) urlInputRef.current.value = '';
    notifyChange(null, null);
  };

  const effectiveHelper = localError ?? helperText;

  return (
    <Stack spacing={1} className={styles.controls}>
      <ImagePreview label={label} preview={preview} placeholder={placeholder} id={inputId} />
      <TextField
        name={name}
        defaultValue={defaultValue}
        label={label}
        required={required}
        fullWidth
        inputRef={urlInputRef}
        onChange={handleUrlChange}
        error={error || Boolean(localError)}
        helperText={effectiveHelper}
      />
      <Stack direction="row" spacing={1} alignItems="center">
        <AdminButton variant="contained" component="label">
          {uploadLabel}
          <input type="file" name={fileName} accept={accept} hidden ref={fileInputRef} onChange={handleFileChange} />
        </AdminButton>
        <AdminButton variant="outlined" color="secondary" onClick={handleClear} type="button">
          {clearLabel}
        </AdminButton>
      </Stack>
      {helperText ? null : (
        <Typography variant="caption" color="text.secondary">
          {maxSizeHint ?? `Max ${maxSizeMb}MB`}
        </Typography>
      )}
    </Stack>
  );
}
