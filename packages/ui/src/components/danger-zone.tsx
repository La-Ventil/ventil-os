'use client';

import type { JSX } from 'react';
import { useState } from 'react';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { resolveFormFeedback, type FormFeedback } from '@repo/form/form-feedback';
import styles from './danger-zone.module.css';

export type DangerZoneProps = {
  title: string;
  description: string;
  actionLabel: string;
  disabled?: boolean;
  onAction: () => Promise<{ success: boolean; message?: string }>;
  onSuccess: () => void;
};

export default function DangerZone({
  title,
  description,
  actionLabel,
  disabled = false,
  onAction,
  onSuccess
}: DangerZoneProps): JSX.Element {
  const [feedback, setFeedback] = useState<FormFeedback | null>(null);

  return (
    <Alert severity="error" icon={false} className={styles.alert}>
      <AlertTitle className={styles.title}>{title}</AlertTitle>
      {description}
      {feedback ? <span className={styles.feedback}>{feedback.message}</span> : null}
      <Button
        variant="outlined"
        color="error"
        className={styles.actionButton}
        disabled={disabled}
        onClick={async () => {
          setFeedback(null);
          const result = await onAction();
          const nextFeedback = resolveFormFeedback(result);
          if (!result.success) {
            setFeedback(nextFeedback);
            return;
          }
          onSuccess();
        }}
      >
        {actionLabel}
      </Button>
    </Alert>
  );
}
