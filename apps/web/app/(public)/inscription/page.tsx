'use client'

import {useActionState, useEffect} from "react";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import ProfilRadioGroup from "@repo/ui/profil-radio-group";
import {inscrireUtilisateur} from "../../../lib/actions/inscrire-utilisateur";
import { signIn } from "next-auth/react";
import {useRouter} from "next/navigation";
import Link from "next/link";

export default function Page() {
    const [formState, formAction, pending] = useActionState(inscrireUtilisateur, {
        message: undefined,
        fieldErrors: [],
        values: {
            prenom: '',
            nom: '',
            email: '',
            motDePasse: '',
            confirmationMotDePasse: '',
            cgu: false
        },
        isValid: undefined,
    });
    const router = useRouter();

    useEffect(() => {
        if (formState?.isValid) {
            async function signInAndRedirect() {
                await signIn("credentials", {
                    redirect: false,
                    email: formState.values.email,
                    password: formState.values.motDePasse
                });
                router.push("/hub/profil");
            }

            signInAndRedirect()
        }
    }, [formState]);

    return (
        <Box>
            <Stack spacing={2}>
                <Typography variant="h2">Inscription</Typography>
                <Typography variant="h3">Information</Typography>
                <Typography variant="body1">
                    Bienvenue sur l’application de La-Ventil.
                    Pour commencer l’aventure, merci de saisir les informations ci-dessous.
                </Typography>
                {formState?.message && !pending && (
                    <Alert severity={formState?.isValid ? 'success' : 'error'}>{formState?.message}</Alert>
                )}
            </Stack>
            <form action={formAction}>
                <Stack spacing={2}>
                    <TextField
                        name={'prenom'}
                        label={'Prénom'}
                        placeholder="mon prénom"
                        required
                    />
                    <TextField
                        name={'nom'}
                        label={'Nom'}
                        placeholder="mon nom"
                        required
                    />
                    <TextField
                        name={'email'}
                        label={'Email'}
                        placeholder="email@email.com"
                        required
                    />
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

                    <ProfilRadioGroup />

                    <FormControlLabel required control={<Checkbox name={'cgu'} />} label="J’accepte les conditions générales d’utilisation de l’application" />
                </Stack>
                <Grid container spacing={2} >
                    <Grid>
                        <Button variant="outlined" color="secondary" component={Link} href="/">Retour</Button>
                    </Grid>
                    <Grid>
                        <Button variant="contained" type="submit" disabled={pending}>S'inscrire</Button>
                    </Grid>
                </Grid>
            </form>
        </Box>

    );
}
