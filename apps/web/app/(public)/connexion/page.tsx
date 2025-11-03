"use client";

import type { NextPage } from "next";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Link from "next/link";

const Signin: NextPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [formState, setFormState] = useState({
        message: '',
        isValid: undefined,
    });
    const router = useRouter();

    async function onSignin(e: FormEvent) {
        e.preventDefault();
        const result = await signIn("credentials", {
            redirect: false,
            email,
            password,
        });

        if (result?.ok) {
            setFormState({
                message: 'success',
                isValid: true,
            });
            router.push("/hub/profil");
        } else {
            setFormState({
                message: 'Signin failed',
                isValid: true,
            });
        }
    }

    return (
        <Box>
            <Stack spacing={2}>
                <Typography variant="h2">Login</Typography>
                <Typography variant="h3">Login</Typography>
                <Typography variant="body1">
                    Login
                </Typography>
                {formState?.message && (
                    <Alert severity={formState?.isValid ? 'success' : 'error'}>{formState?.message}</Alert>
                )}
            </Stack>
            <form onSubmit={(e) => void onSignin(e)}>
                <Stack spacing={2}>
                    <TextField
                        name={'email'}
                        value={email}
                        onChange={(e) => setEmail(e.currentTarget.value)}
                        label={'Email'}
                        placeholder="email@email.com"
                        required
                    />
                    <TextField
                        name={'motDePasse'}
                        label={'Mot de passe'}
                        value={password}
                        onChange={(e) => setPassword(e.currentTarget.value)}
                        placeholder="minimum 5 caractères"
                        required
                    />
                </Stack>
                <Grid container spacing={2} >
                    <Grid>
                        <Button variant="outlined" color="secondary" component={Link} href="/">Retour</Button>
                    </Grid>
                    <Grid>
                        <Button variant="contained" type="submit">Sign me in</Button>
                    </Grid>
                </Grid>
                <Grid container spacing={2} >
                    <Link href="/mot-de-passe-oublie">J'ai oublié mon mot de passe.</Link>
                </Grid>
            </form>
        </Box>
    );
};

export default Signin;