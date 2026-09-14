'use client';

import { useState, useTransition } from 'react';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

export type ResendVerificationLabels = {
  cta: string;
  sent: string;
  error: string;
};

export type ResendVerificationProps = {
  email: string;
  onResend: (email: string) => Promise<{ ok: boolean }>;
  labels: ResendVerificationLabels;
};

/**
 * Way out of the dead end an expired verification link used to create: the account could not be
 * verified, its address was taken, sign-in was refused, and nothing on screen led anywhere.
 *
 * The button stays on screen after a successful send: replacing it would unmount the element the
 * reader just activated, dropping keyboard focus back to the top of the page.
 */
export default function ResendVerification({ email, onResend, labels }: ResendVerificationProps) {
  const [isPending, startTransition] = useTransition();
  const [outcome, setOutcome] = useState<'idle' | 'sent' | 'error'>('idle');

  const requestNewLink = () => {
    setOutcome('idle');
    startTransition(async () => {
      try {
        const result = await onResend(email);
        setOutcome(result.ok ? 'sent' : 'error');
      } catch {
        setOutcome('error');
      }
    });
  };

  return (
    <Stack spacing={2}>
      {/* A confirmation should wait its turn rather than interrupt, unlike MUI's default alert role. */}
      {outcome === 'sent' ? (
        <Alert severity="success" role="status">
          {labels.sent}
        </Alert>
      ) : null}
      {outcome === 'error' ? <Alert severity="error">{labels.error}</Alert> : null}
      <Button variant="contained" onClick={requestNewLink} loading={isPending}>
        {labels.cta}
      </Button>
    </Stack>
  );
}
