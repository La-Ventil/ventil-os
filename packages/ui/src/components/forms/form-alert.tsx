import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';

export interface FormAlertProps {
  message?: string;
  success?: boolean;
  isPending?: boolean;
  showRetry?: boolean;
  retryLabel?: string;
  onRetry?: () => void;
}

export default function FormAlert({ message, success, isPending, showRetry, retryLabel, onRetry }: FormAlertProps) {
  if (!message || isPending) return null;

  return (
    <Alert
      severity={success ? 'success' : 'error'}
      action={
        showRetry ? (
          <Button color="inherit" size="small" onClick={onRetry}>
            {retryLabel}
          </Button>
        ) : null
      }
    >
      {message}
    </Alert>
  );
}
