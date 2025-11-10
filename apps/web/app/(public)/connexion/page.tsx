'use client';

import type { NextPage } from 'next';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from 'next/link';
import ConnexionForm from '@repo/ui/forms/connexion.form';

const Signin: NextPage = () => {
  return (
    <Box>
      <Stack spacing={2}>
        <Typography variant="h2">Login</Typography>
        <Typography variant="h3">Login</Typography>
        <Typography variant="body1">Login</Typography>
      </Stack>
      <ConnexionForm />
      <Stack spacing={2}>
        <Link href="/mot-de-passe-oublie">J'ai oublié mon mot de passe.</Link>
      </Stack>
    </Box>
  );
};

export default Signin;
