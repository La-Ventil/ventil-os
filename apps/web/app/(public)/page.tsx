import {useTranslations} from "next-intl";
import Link from 'next/link'
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import BottomSlot from "@repo/ui/bottom-slot";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";

export default function Home() {
    const t = useTranslations('HomePage');
    return (
        <Box>
            <Stack spacing={2}>
                <Typography variant="body1">
                    Bienvenue sur l’application de La-Ventil.
                    Pour commencer l’aventure, merci de saisir les informations ci-dessous.
                </Typography>
            </Stack>
            <BottomSlot>
                <Grid container spacing={2} >
                    <Grid>
                        <Button variant="outlined" component={Link} href="/inscription">M'inscrire</Button>
                    </Grid>
                    <Grid>
                        <Button variant="contained" component={Link} href="/connexion">Se connecter</Button>
                    </Grid>
                </Grid>
            </BottomSlot>
        </Box>
    );
}
