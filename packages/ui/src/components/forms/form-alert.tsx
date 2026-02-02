import { useTranslations } from 'next-intl';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import type { FormState } from '@repo/form/form-state';

export interface FormAlertProps {
  state?: FormState<Record<string, string | string[] | undefined>>;
  isPending?: boolean;
  onRetry?: () => void;
}

export default function FormAlert({ state, isPending, onRetry }: FormAlertProps) {
  const tCommon = useTranslations('common');
  const message = state?.message ?? '';
  const success = state?.success ?? false;
  const showRetry = message === tCommon('errors.network');

  if (!message || isPending) return null;

  return (
    <Alert
      severity={success ? 'success' : 'error'}
      action={
        showRetry ? (
          <Button color="inherit" size="small" onClick={onRetry}>
            {tCommon('actions.retry')}
          </Button>
        ) : null
      }
    >
      {message}
    </Alert>
  );
}
