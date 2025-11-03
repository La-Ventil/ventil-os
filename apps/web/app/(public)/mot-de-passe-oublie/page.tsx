'use client'

import {useActionState} from "react";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import {resetPassword} from "../../../lib/actions/reset-password";

export default function Page() {
    const [formState, formAction, pending] = useActionState(resetPassword, {
        message: undefined,
        fieldErrors: [],
        values: {
            email: '',
        },
        isValid: undefined,
    });

    return (
        <Box>
            <Stack spacing={2}>
                <Typography variant="h2">J'ai oublié mon mot de passe</Typography>
                <Typography variant="body1">Renseigner l'email utilisé lors de l'inscription.</Typography>
                {formState?.message && !pending && (
                    <Alert severity={formState?.isValid ? 'success' : 'error'}>{formState?.message}</Alert>
                )}
            </Stack>
            <form action={formAction}>
                <Stack spacing={2}>
                    <TextField
                        name={'email'}
                        label={'Email'}
                        placeholder="email@email.com"
                        required
                    />
                </Stack>
                <Grid container spacing={2} >
                    <Grid>
                        <Button variant="outlined" color="secondary">Retour</Button>
                    </Grid>
                    <Grid>
                        <Button variant="contained" type="submit" disabled={pending}>Envoyer le lien de réinitialisation.</Button>
                    </Grid>
                </Grid>
            </form>
        </Box>

    );
}
