'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export type AutoRedirectProps = {
  redirectLabel: string;
  redirectingLabel: string;
  redirectTo: string;
  autoRedirectMs?: number;
};

export default function AutoRedirect({
  redirectLabel,
  redirectingLabel,
  redirectTo,
  autoRedirectMs = 2500
}: AutoRedirectProps) {
  const router = useRouter();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      router.push(redirectTo);
    }, autoRedirectMs);

    return () => window.clearTimeout(timer);
  }, [autoRedirectMs, redirectTo, router]);

  return (
    <>
      <Typography variant="body2">{redirectingLabel}</Typography>
      <Button variant="contained" onClick={() => router.push(redirectTo)}>
        {redirectLabel}
      </Button>
    </>
  );
}
