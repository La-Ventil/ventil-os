import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DraftsIcon from '@mui/icons-material/Drafts';
import SendIcon from '@mui/icons-material/Send';
import Link from '@repo/ui/link';

export default async function Page() {
  return (
    <Stack spacing={2}>
      <Typography variant="h2">Paramètres</Typography>
      <Typography variant="h3">Information</Typography>
      <Typography variant="body1">Modifiez les informations de votre compte avec les rubriques ci-dessous.</Typography>
      <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }} component="nav">
        <ListItemButton component={Link} href="/hub/parametres/profil">
          <ListItemIcon>
            <SendIcon />
          </ListItemIcon>
          <ListItemText primary="information du profil" />
        </ListItemButton>
        <ListItemButton component={Link} href="/hub/parametres/avatar">
          <ListItemIcon>
            <DraftsIcon />
          </ListItemIcon>
          <ListItemText primary="avatar" />
        </ListItemButton>
      </List>
    </Stack>
  );
}
