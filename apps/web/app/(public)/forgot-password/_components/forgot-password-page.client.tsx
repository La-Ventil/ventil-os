'use client';

import type { JSX } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ResetPasswordForm from '@repo/ui/forms/reset-password.form';
import { resetPasswordAction } from '../../../../lib/actions/auth/reset-password';

type ForgotPasswordPageClientProps = {
  title: string;
  intro: string;
};

export default function ForgotPasswordPageClient({ title, intro }: ForgotPasswordPageClientProps): JSX.Element {
  return (
    <Box>
      <Stack spacing={2}>
        <Typography variant="h2">{title}</Typography>
        <Typography variant="body1">{intro}</Typography>
      </Stack>
      <ResetPasswordForm handleSubmit={resetPasswordAction} />
    </Box>
  );
}
