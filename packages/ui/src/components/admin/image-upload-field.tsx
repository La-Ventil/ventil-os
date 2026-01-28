import TextField from '@mui/material/TextField';
import AdminButton from './admin-button';
import styles from './image-upload-field.module.css';

export type ImageUploadFieldProps = {
  label: string;
  placeholder: string;
  uploadLabel: string;
  required?: boolean;
  name?: string;
  previewUrl?: string;
  accept?: string;
};

export default function ImageUploadField({
  label,
  placeholder,
  uploadLabel,
  required = false,
  name = 'image',
  previewUrl,
  accept = 'image/*'
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
        <TextField label={label} required={required} fullWidth />
        <AdminButton variant="contained" component="label">
          {uploadLabel}
          <input type="file" name={name} accept={accept} hidden />
        </AdminButton>
      </div>
    </>
  );
}
