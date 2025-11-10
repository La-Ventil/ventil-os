'use client';

import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import ResetPasswordForm from '@repo/ui/forms/reset-password.form';
import { resetPassword } from '../../../lib/actions/reset-password';

export default function Page() {
  return (
    <Box>
      <Stack spacing={2}>
        <Typography variant="h2">J'ai oublié mon mot de passe</Typography>
        <Typography variant="body1">Renseigner l'email utilisé lors de l'inscription.</Typography>
      </Stack>
      <ResetPasswordForm handleSubmit={resetPassword} />
    </Box>
  );
}
