'use client'

import {useActionState, useEffect} from "react";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import {useRouter} from "next/navigation";
import {signInAndRedirect} from "../../../../lib/auth";
import {updatePassword} from "../../../../lib/actions/update-password";

export default function Page() {
    const [formState, formAction, pending] = useActionState(updatePassword, {
        token: 'caca',
        message: undefined,
        fieldErrors: [],
        values: {
            email: '',
            motDePasse: '',
            confirmationMotDePasse: '',
        },
        isValid: undefined,
    });
    const router = useRouter();

    useEffect(() => {
        if (formState?.isValid) {
            signInAndRedirect(router)(formState.values.email, formState.values.motDePasse);
        }
    }, [formState]);

    return (
        <Box>
            <Stack spacing={2}>
                <Typography variant="h2">Mettre à jour mon mot de passe</Typography>
                <Typography variant="body1">
                    Mettre à jour mon mot de passe
                </Typography>
                {formState?.message && !pending && (
                    <Alert severity={formState?.isValid ? 'success' : 'error'}>{formState?.message}</Alert>
                )}
            </Stack>
            <form action={formAction}>
                <Stack spacing={2}>
                    <TextField
                        name={'motDePasse'}
                        label={'Mot de passe'}
                        placeholder="minimum 5 caractères"
                        required
                    />
                    <TextField
                        name={'confirmationMotDePasse'}
                        label={'Confirmation du mot de passe'}
                        placeholder="même mot de passe que le champ précédent"
                        required
                    />
                </Stack>
                <Grid container spacing={2} >
                    <Grid>
                        <Button variant="outlined" color="secondary">Retour</Button>
                    </Grid>
                    <Grid>
                        {formState?.message && <p aria-live="polite">{formState?.message}</p>}
                        <Button variant="contained" type="submit" disabled={pending}>Changer mon mot de passe</Button>
                    </Grid>
                </Grid>
            </form>
        </Box>

    );
}
