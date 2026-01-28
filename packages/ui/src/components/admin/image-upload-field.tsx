import TextField from '@mui/material/TextField';
import AdminButton from './admin-button';
import styles from './image-upload-field.module.css';

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
  helperText
}: ImageUploadFieldProps) {
  return (
    <>
      <div className={styles.preview}>
        {previewUrl ? (
          <img className={styles.previewImage} src={previewUrl} alt={label} />
        ) : (
          placeholder
        )}
      </div>
      <div className={styles.controls}>
        <TextField
          name={name}
          defaultValue={defaultValue}
          label={label}
          required={required}
          fullWidth
          error={error}
          helperText={helperText}
        />
        <AdminButton variant="contained" component="label">
          {uploadLabel}
          <input type="file" name={fileName} accept={accept} hidden />
        </AdminButton>
      </div>
    </>
  );
}
