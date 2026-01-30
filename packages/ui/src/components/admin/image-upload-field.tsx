"use client";

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import AdminButton from './admin-button';
import styles from './image-upload-field.module.css';
import { ChangeEvent, useEffect, useId, useRef, useState } from 'react';
import ImagePreview from './image-preview';

export type ImageUploadFieldProps = {
  name?: string;
  label: string;
  placeholder: string;
  uploadLabel: string;
  required?: boolean;
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
  invalidTypeLabel?: string;
  onChange?: (payload: { file: File | null; preview: string | null }) => void;
  resetKey?: string | number;
};

export default function ImageUploadField({
  label,
  placeholder,
  uploadLabel,
  required = false,
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
  invalidTypeLabel,
  onChange,
  resetKey
}: ImageUploadFieldProps) {
  const inputId = useId();
  const fileInputName = name ?? fileName;
  const [preview, setPreview] = useState<string | null>(previewUrl || defaultValue || null);
  const [localError, setLocalError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPreview(previewUrl || defaultValue || null);
  }, [defaultValue, previewUrl]);

  useEffect(() => () => {
    if (preview && preview.startsWith('blob:')) {
      URL.revokeObjectURL(preview);
    }
  }, [preview]);

  // Reset when parent indicates success/refresh via resetKey
  useEffect(() => {
    if (preview && preview.startsWith('blob:')) {
      URL.revokeObjectURL(preview);
    }
    setPreview(null);
    setLocalError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    notifyChange(null, null);
  }, [resetKey]);

  const notifyChange = (file: File | null, newPreview: string | null) => {
    onChange?.({ file, preview: newPreview });
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setLocalError(null);
      return;
    }

    if (!file.type.startsWith('image/')) {
      const message = invalidTypeLabel ?? 'Invalid file type. Please select an image.';
      setLocalError(message);
      event.target.value = '';
      notifyChange(null, preview);
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

  const handleClear = () => {
    if (preview && preview.startsWith('blob:')) {
      URL.revokeObjectURL(preview);
    }
    setPreview(null);
    setLocalError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    notifyChange(null, null);
  };

  const effectiveHelper = localError ?? helperText;
  const showHelper = Boolean(effectiveHelper);
  const hintText = maxSizeHint ?? `Max ${maxSizeMb}MB`;

  return (
    <Stack spacing={1} className={styles.controls}>
      <ImagePreview label={label} preview={preview} placeholder={placeholder} id={inputId} />
      <Stack direction="row" spacing={1} alignItems="center">
        <AdminButton variant="contained" component="label">
          {uploadLabel}
          <input
            type="file"
            name={fileInputName}
            accept={accept}
            hidden
            ref={fileInputRef}
            onChange={handleFileChange}
            required={required}
          />
        </AdminButton>
        <AdminButton variant="outlined" color="secondary" onClick={handleClear} type="button">
          {clearLabel}
        </AdminButton>
      </Stack>
      {showHelper ? (
        <Typography variant="caption" color={localError ? 'error' : 'text.secondary'}>
          {effectiveHelper}
        </Typography>
      ) : null}
      <Typography variant="caption" color="text.secondary">
        {hintText}
      </Typography>
    </Stack>
  );
}
